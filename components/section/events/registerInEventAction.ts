"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function registerInEventAction(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.eventRegistration.findFirstOrThrow({
      where: {
        eventId,
        userId: user.id,
      },
    });
    return { error: "Already registered in this event" };
  } catch (error) {
    try {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          current_registration_count: {
            increment: 1,
          },
          registrations: {
            create: {
              userId: user.id,
            },
          },
        },
      });
      return { success: true };
    } catch (error) {
      return { error: "Failed to register in event" };
    } finally {
      await prisma.$disconnect();
    }
  }
}
