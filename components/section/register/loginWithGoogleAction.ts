"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogleAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },
      scopes: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      redirectTo: `${process.env.BASE_URL}/auth/callback?next=/onboarding`,
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    console.error("Error during Google sign in:", error);
    return { error: "Failed to sign in with Google" };
  }
}
