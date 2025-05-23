"use server";

import { registerStudentSchema, RegisterStudentSchema } from "@/schemas/registerSchema";
import { createClient } from "@/utils/supabase/server";

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
        full_name: `${firstName} ${lastName}`,
      },
      emailRedirectTo: "http://localhost:3000/onboarding",
      captchaToken,
    },
  });

  if (signUpError || !userData || !userData.user) {
    return { error: signUpError ? signUpError.message : "Failed to register user with Supabase" };
  }

  return { success: true };
}
