"use server";

import { QRCodeService } from "@/lib/qr-code";
import { onboardingStudentSchema, OnboardingStudentSchema } from "@/schemas/onboardingStudentSchema";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function onboardingStudent(data: OnboardingStudentSchema) {
  const validatedData = onboardingStudentSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Onboarding data is invalid" };
  }

  const prisma = new PrismaClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not found" };
  }

  try {
    if (validatedData.data.studentType === "atmiya") {
      const { departmentId, programId, currentSemester, currentYear, registrationNumber } = validatedData.data;
      await prisma.student.update({
        where: {
          userId: user.id,
        },
        data: {
          departmentId,
          programId,
          currentSemester,
          currentYear,
          registrationNumber,
          university: null,
        },
      });
    } else if (validatedData.data.studentType === "other") {
      const { currentSemester, currentYear, universityName } = validatedData.data;
      await prisma.student.update({
        where: {
          userId: user.id,
        },
        data: {
          departmentId: null,
          programId: null,
          currentSemester,
          currentYear,
          registrationNumber: null,
          university: universityName,
        },
      });
    }

    // Generate QR code for the user
    // Generate new QR code for the user
    const { qrCode, qrCodeData } = await QRCodeService.generateUserQRCode(user.id);

    // Update user with QR code
    await prisma.user.update({
      where: { supabaseId: user.id },
      data: {
        qrCode,
        qrCodeData
      }
    });

    await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        role: "STUDENT",
        onboarding_complete: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error during onboarding:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return { error: "Failed to complete onboarding", message: errorMessage };
  } finally {
    await prisma.$disconnect();
  }
}
