"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUserFromRequest(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
