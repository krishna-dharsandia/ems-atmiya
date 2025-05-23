"use client";
import OnboardingForm from "@/components/section/onboarding/OnboardingForm";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";
import { createClient } from "@/utils/supabase/client";
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
    <div className="container mx-auto space-y-2 max-w-5xl">
      <OnboardingForm />
    </div>
  );
}
