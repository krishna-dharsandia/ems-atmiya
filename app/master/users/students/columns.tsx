"use client";

import destroyStudent from "@/components/section/master/students/deleteStudentAction";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type Student = {
  id: string;
  registrationNumber?: string;
  user: { firstName: string; lastName: string; email: string, id: string, phone: string | null };
  department?: { name: string };
  program?: { name: string };
  university?: string;
  currentSemester?: number;
  currentYear?: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "registrationNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Reg. No.
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const regNo = row.original.registrationNumber;
      return (
        <div className="max-w-[120px] truncate font-mono text-sm" title={regNo}>
          {regNo || "N/A"}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 130,
    minSize: 100,
    maxSize: 180,
    cell: ({ row }) => {
      const firstName = row.original.user.firstName;
      const lastName = row.original.user.lastName;
      return (
        <div className="max-w-[130px] break-words" title={firstName}>
          {firstName}  {lastName}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.user.email,
    id: "email",
    header: "Email",
    size: 200,
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => {
      const email = row.original.user.email;
      return (
        <div className="max-w-[200px] break-all text-sm" title={email}>
          {email}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.user.phone,
    id: "phone",
    header: "Phone",
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const phone = row.original.user.phone;
      return (
        <div className="max-w-[120px] break-words font-mono text-sm" title={phone || "N/A"}>
          {phone || "N/A"}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.university,
    accessorKey: "university",
    header: "University",
    size: 200,
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => {
      const university = row.original.university;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate text-sm cursor-help">
                {university || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{university || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    accessorFn: (row) => row.department?.name,
    accessorKey: "departmentName",
    header: "Department",
    size: 150,
    minSize: 120,
    maxSize: 200,
    cell: ({ row }) => {
      const dept = row.original.department?.name;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[150px] truncate text-sm cursor-help">
                {dept || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{dept || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorFn: (row) => row.program?.name,
    accessorKey: "programName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Program
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 180,
    minSize: 140,
    maxSize: 250,
    cell: ({ row }) => {
      const program = row.original.program?.name;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[180px] truncate text-sm cursor-help">
                {program || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{program || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "currentSemester",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Semester
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 80,
    minSize: 70,
    maxSize: 100,
    cell: ({ row }) => {
      const semester = row.original.currentSemester;
      return (
        <div className="text-center font-semibold">
          {semester || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "currentYear",
    header: "Year",
    size: 80,
    minSize: 70,
    maxSize: 100,
    cell: ({ row }) => {
      const year = row.original.currentYear;
      return (
        <div className="text-center font-semibold">
          {year || "N/A"}
        </div>
      );
    },
  }, {
    id: "actions",
    header: "Actions",
    size: 80,
    minSize: 70,
    maxSize: 100,
    enableSorting: false,
    enableResizing: false,
    cell: ({ row }) => {
      const student = row.original;
      async function handleDelete() {
        const res = await destroyStudent(student.user.id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Student deleted successfully");
        }
      }
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert(`Edit student with ID: ${student.id}`)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" color="red" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
