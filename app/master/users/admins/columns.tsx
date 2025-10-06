"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type Admin = {
  id: string;
  user: { firstName: string; lastName: string; email: string };
};

export const columns: ColumnDef<Admin>[] = [
  {
    accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorFn: (row) => row.user.email,
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const admin = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert(`Edit admin with ID: ${admin.id}`)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => toast.error("Delete action not implemented yet.")}>
              <Trash2 color="red" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
