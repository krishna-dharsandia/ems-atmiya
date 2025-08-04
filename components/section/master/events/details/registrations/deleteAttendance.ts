"use server";

import {PrismaClient } from "@prisma/client";

export async function deleteAttendance(registrationId: string) {
  const prisma = new PrismaClient();
  try {
    await prisma.eventRegistration.delete({
      where: { id: registrationId },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
