"use client";
import OnboardingForm from "@/components/section/onboarding/OnboardingForm";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";
import { createClient } from "@/utils/supabase/client";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.user_metadata.onboarding_complete) {
        const dashboardPath = getDashboardPath(user.user_metadata.role);
        router.push(dashboardPath);
      }
    }

    checkUser();
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          EMS
        </a>
        <OnboardingForm />
      </div>
    </div>
  );
}
