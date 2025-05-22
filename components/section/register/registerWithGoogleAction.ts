"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function registerWithGoogleAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    console.error("Error during Google sign-in:", error);
    return { error: "Failed to sign in with Google" };
  }
}
