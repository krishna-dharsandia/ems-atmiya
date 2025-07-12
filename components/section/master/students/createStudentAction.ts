"use server";

import { studentSchema, StudentSchema } from "@/schemas/student";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createStudentAction(data: StudentSchema, captchaToken: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = studentSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid student data" };
  }

  const { firstName, lastName, email, password, departmentId, programId, currentSemester, currentYear, registrationNumber, dateOfBirth } = validatedData.data;

  const { data: userData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "STUDENT",
        onboarding_complete: true,
        full_name: `${firstName} ${lastName}`,
      },
      emailRedirectTo: "http://localhost:3000/student",
      captchaToken,
    },
  });

  if (error || !userData || !userData.user) {
    return { error: error ? error.message : "Failed to register user with Supabase" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        supabaseId: userData.user.id,
        firstName,
        lastName,
        email,
        role: "STUDENT",
        students: {
          create: {
            departmentId,
            programId,
            currentSemester,
            currentYear,
            dateOfBirth,
            registrationNumber,
          },
        },
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to create student" };
  } finally {
    await prisma.$disconnect();
  }
}
