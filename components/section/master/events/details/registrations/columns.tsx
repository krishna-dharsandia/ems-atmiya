import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toggleAttendance } from "./toggleAttendanceAction";
import { toast } from "sonner";
import { deleteAttendance } from "./deleteAttendance";

export type EventRegistration = {
  id: string;
  userId: string;
  eventId: string;
  attended: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    supabaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    students: {
      id: string;
      userId: string;
      departmentId: string;
      programId: string;
      currentSemester: number | null;
      currentYear: number | null;
      registrationNumber: string | null;
      dateOfBirth: Date | null;
      createdAt: Date;
      updatedAt: Date;
      department: {
        id: string;
        name: string;
        faculty: string;
      };
      program: {
        id: string;
        name: string;
      };
    }[];
    admins: {
      id: string;
      userId: string;
      departmentId: string;
      programId: string;
      position: string;
      createdAt: Date;
      updatedAt: Date;
      department: {
        id: string;
        name: string;
        faculty: string;
      };
      program: {
        id: string;
        name: string;
      };
    }[];
  };
};

export const columns: ColumnDef<EventRegistration>[] = [
  {
    accessorKey: "user.firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "user.lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registration Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "attended",
    header: "Attended",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.attended ? "default" : "destructive"}
          className="w-fit"
        >
          {row.original.attended ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const registration = row.original;

      async function handleDelete() {
        const response = await deleteAttendance(registration.id);
        if (response.success) {
          toast.success("Registration deleted successfully");
        }
        else {
          toast.error(`Error: ${response.error}`);
        }
      }

      async function handleToggleAttendance() {
        const response = await toggleAttendance(registration.id);
        if(response.success) {
          toast.success(
            `Registration ${registration.attended ? "marked as not attended" : "marked as attended"}`
          );
        } else {
          toast.error(`Error: ${response.error}`);
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleToggleAttendance}>
              {registration.attended ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Mark as Not Attended
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" /> Mark as Attended
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                alert(`Edit registration with ID: ${registration.id}`)
              }
            >
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              <Trash2 color="red" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
