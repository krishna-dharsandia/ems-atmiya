"use server";

import { updatePasswordSchema, UpdatePasswordSchema } from "@/schemas/updatePasswordSchema";
import { createClient } from "@/utils/supabase/server";

export async function updatePasswordAction(data: UpdatePasswordSchema) {
  const validatedData = updatePasswordSchema.parse(data);
  if (!validatedData) {
    return {
      error: "Invalid data provided for password update.",
    };
  }

  const supabase = await createClient();
  const { password } = validatedData;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Password updated successfully.",
  };
}
