"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import { ModeToggle } from "@/components/global/mode-toggle/ModelToggler";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";

export function LandingHeader() {
  const { user, refreshUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const response = await supabase.auth.signOut();

    if (response.error) {
      toast.error(response.error.message);
    } else {
      await refreshUser();
      toast.success("Successfully logged out.");
      router.replace("/");
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  Atmiya University
                </span>
                <span className="text-xs text-muted-foreground">Event Management System</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={getDashboardPath(user.app_metadata.role)}>
                  <Button variant="default">
                    Profile
                  </Button>
                </Link>
                <Button variant={"ghost"} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex flex-col space-y-2">
                  {!user ? (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-primary text-primary-foreground">
                          Register
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href={getDashboardPath(user.app_metadata.role)} onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-foreground">
                          Profile
                        </Button>
                      </Link>
                      <Button
                        className="w-full bg-primary text-primary-foreground"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
