"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function registerWithGoogleAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.BASE_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    console.error("Error during Google sign-in:", error);
    return { error: "Failed to sign in with Google" };
  }
}
