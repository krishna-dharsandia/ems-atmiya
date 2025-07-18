"use client";

import RegisterForm from "@/components/section/register/RegisterForm";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";
import { createClient } from "@/utils/supabase/client";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push(getDashboardPath(user.user_metadata.role));
        return;
      }
    }

    check();
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          EMS
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
