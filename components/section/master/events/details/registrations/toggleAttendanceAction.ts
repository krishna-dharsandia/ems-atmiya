"use server";
import { PrismaClient } from "@prisma/client";

export async function toggleAttendance(registrationId: string) {
  const prisma = new PrismaClient();
  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      select: { attended: true },
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { attended: !registration.attended },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
