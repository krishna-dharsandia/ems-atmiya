"use server";

import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/reset-password";
import { createClient } from "@/utils/supabase/server";

export async function sendResetPasswordLinkAction(data: ResetPasswordSchema, token: string) {
  const validatedData = resetPasswordSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid email address" };
  }

  const supabase = await createClient();
  const { email } = validatedData.data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    captchaToken: token,
  });
  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Reset password link sent to your email" };
}
