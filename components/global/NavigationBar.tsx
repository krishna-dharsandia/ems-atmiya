"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function NavigationBar() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function main() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    main();
  });

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="text-lg font-bold">EMS</div>
        {user ? (
          <div className="flex space-x-4">
            <a href="/profile">Profile</a>
            <Button type="button" onClick={handleSignout} className="cursor-pointer">
              Signout
            </Button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        )}
      </nav>
    </header>
  );
}
