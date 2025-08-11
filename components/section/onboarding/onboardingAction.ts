"use server";

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

    await supabase.auth.updateUser({
      data: {
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
