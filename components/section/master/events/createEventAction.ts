"use server";

import { QRCodeService } from "@/lib/qr-code";
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
    const event = await prisma.event.create({
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
        qrCode: "",
        qrCodeData: "",
      },
    });

    // Generate QR code directly instead of making HTTP request
    try {
      const { qrCode, qrCodeData } = await QRCodeService.generateEventURLQRCode(event.id);

      // Update the event with the generated QR code
      await prisma.event.update({
        where: { id: event.id },
        data: {
          qrCode,
          qrCodeData,
        },
      });
    } catch (qrError) {
      console.error("Failed to generate QR code:", qrError);
      // Don't fail the entire event creation if QR code generation fails
    }

    return { success: true, data: event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  } finally {
    await prisma.$disconnect();
  }
}
