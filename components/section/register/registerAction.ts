"use server";

import { registerStudentSchema, RegisterStudentSchema } from "@/schemas/registerStudentSchema";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient, User } from "@prisma/client";
import { AuthError } from "@supabase/supabase-js";

export async function registerStudent(data: RegisterStudentSchema, captchaToken: string) {
  const validatedData = registerStudentSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Registration data is invalid" };
  }

  const supabase = await createClient();
  const { firstName, lastName, email, password } = validatedData.data;

  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "STUDENT",
        onboarding_complete: false,
      },
      emailRedirectTo: "http://localhost:3000/onboarding",
      captchaToken,
    },
  });

  if (signUpError || !userData || !userData.user) {
    return { error: signUpError ? signUpError.message : "Failed to register user with Supabase" };
  }

  const prisma = new PrismaClient();
  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        supabaseId: userData.user.id,
        email,
        firstName,
        lastName,
        role: "STUDENT",
        students: {
          create: {},
        },
      },
    });

    return { success: true };
  } catch {
    return { error: "Failed to create user in database" };
  } finally {
    await prisma.$disconnect();
  }
}
