"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createAdminDialogAtom, createMasterDialogAtom, createStudentDialogAtom } from "@/store/form-dialog";
import { createClient } from "@/utils/supabase/client";
import { Role } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { useSetAtom } from "jotai";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function QuickActionToggle() {
  const { user } = useAuth(); // Use auth context instead of direct calls
  const setStudentDialog = useSetAtom(createStudentDialogAtom);
  const setAdminDialog = useSetAtom(createAdminDialogAtom);
  const setMasterDialog = useSetAtom(createMasterDialogAtom);

  if (!user) return null;

  function renderBasedOnRole() {
    const role = user?.app_metadata.role;
    switch (role) {
      case Role.ADMIN:
        return (
          <>
            <DropdownMenuItem>Events</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStudentDialog((prev) => !prev)}>Students</DropdownMenuItem>
          </>
        );
      case Role.MASTER:
        return (
          <>
            <DropdownMenuItem>Events</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStudentDialog((prev) => !prev)}>Students</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAdminDialog((prev) => !prev)}>Admins</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMasterDialog((prev) => !prev)}>Masters</DropdownMenuItem>
          </>
        );
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"}>
          <PlusCircle className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {renderBasedOnRole()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
