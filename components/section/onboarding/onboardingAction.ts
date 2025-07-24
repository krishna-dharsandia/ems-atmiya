"use server";

import { onboardingStudentSchema, OnboardingStudentSchema } from "@/schemas/onboardingStudentSchema";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function onboardingStudent(data: OnboardingStudentSchema) {
  const validatedData = onboardingStudentSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Onboarding data is invalid" };
  }

  const { departmentId, programId, currentSemester, currentYear, registrationNumber } = validatedData.data;
  const prisma = new PrismaClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not found" };
  }

  try {
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
      },
    });

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
