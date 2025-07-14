"use server";

import { formattedEventSchema, FormattedEventSchema } from "@/schemas/event";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createEventAction(data: FormattedEventSchema) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = formattedEventSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid event data" };
  }

  const { speakers } = validatedData.data;
  const prisma = new PrismaClient();

  try {
    await prisma.event.create({
      data: {
        ...validatedData.data,
        poster_url: validatedData.data.poster_url ?? "",
        speakers: {
          create: speakers.map((speaker) => ({
            name: speaker.name,
            bio: speaker.bio,
            photo_url: speaker.photo_url ?? "",
          })),
        },
        createdById: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to create event" };
  } finally {
    await prisma.$disconnect();
  }
}
