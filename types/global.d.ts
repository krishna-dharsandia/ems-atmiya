import { Role } from "@/app/generated/prisma";
import type { UserMetadata as SupabaseUserMetadata } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface UserMetadata extends SupabaseUserMetadata {
    role: Role;
    onboarding_complete: boolean;
    full_name: string;
  }
}
