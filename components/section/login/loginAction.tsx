"use server";
import { loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { createClient } from "@/utils/supabase/server";

export async function login(data: LoginSchema, captchaToken: string) {
  const validatedData = loginSchema.safeParse(data);
  if (!validatedData.success) {
    console.log("Login data validation failed:", validatedData.error);
    return { error: "Login data is invalid" };
  }

  const { email, password } = validatedData.data;
  const supabase = await createClient();

  const {
    data: { user: user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

  if (error || !user) {
    return { error: error ? error.message : "Failed to login user with Supabase" };
  }

  return { success: true, message: user.app_metadata.role };
}
