"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";
import { GalleryVerticalEnd } from "lucide-react";
import { PUBLIC_ROUTES } from "@/utils/supabase/middleware";

export default function NavigationBar() {
  const [user, setUser] = useState<User | null>(null);
  const [showNav, setShowNav] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  }

  useEffect(() => {
    async function main() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    main();

    // Check if current route is public
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      setShowNav(isPublicRoute(pathname));
    }
  }, []);

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  }

  if (!showNav) return null;

  return (
    <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          EMS
        </a>

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button variant="outline" className="hidden sm:inline-flex rounded-full" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button className="rounded-full" onClick={() => router.push("/register")}>
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="hidden sm:inline-flex rounded-full" onClick={handleSignout}>
                Sign Out
              </Button>
              <Button className="rounded-full" onClick={() => router.push(getDashboardPath(user.user_metadata.role))}>
                Dashboard
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}
