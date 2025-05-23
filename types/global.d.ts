import { Role } from "@/app/generated/prisma";
import type { UserMetadata as SupabaseUserMetadata } from "@supabase/supabase-js";
import { initialize } from "next/dist/server/lib/render-server";

declare module "@supabase/supabase-js" {
  interface UserMetadata extends SupabaseUserMetadata {
    role: Role;
    onboarding_complete: boolean;
    full_name: string;
  }
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: any) => void }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              type: string;
              theme?: string;
              size?: string;
            }
          ) => void;
        };
      };
    };
  }
}
