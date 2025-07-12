"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createAdminDialogAtom, createMasterDialogAtom, createStudentDialogAtom } from "@/store/form-dialog";
import { useSetAtom } from "jotai";
import { PlusCircle } from "lucide-react";

export default function QuickActionToggle() {
  const setStudentDialog = useSetAtom(createStudentDialogAtom);
  const setAdminDialog = useSetAtom(createAdminDialogAtom);
  const setMasterDialog = useSetAtom(createMasterDialogAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"}>
          <PlusCircle className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem>Events</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setStudentDialog((prev) => !prev)}>Students</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAdminDialog((prev) => !prev)}>Admins</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMasterDialog((prev) => !prev)}>Masters</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
