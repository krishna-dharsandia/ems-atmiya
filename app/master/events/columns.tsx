"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EventMode, EventStatus, EventType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction } from "./actions";

export type Event = {
  id: string;
  slug: string;
  name: string;
  description: string;
  mode: EventMode;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  event_type: EventType;
  status: EventStatus;
  registration_required: boolean;
  registration_limit?: number;
  organizer_name: string;
  is_paid: boolean;
  ticket_price?: number;
  current_registration_count: number;
  feedback_score: number;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Slug
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.getValue<EventMode>("mode");
      let color: string;
      switch (mode) {
        case EventMode.ONLINE:
          color = "blue";
          break;
        case EventMode.OFFLINE:
          color = "green";
          break;
        default:
          color = "gray";
      }
      return <Badge className={`bg-${color}-500 text-white`}>{mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}</Badge>;
    },
  },
  {
    accessorKey: "event_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<EventType>("event_type");
      let color: string;
      switch (type) {
        case EventType.SESSION:
          color = "purple";
          break;
        case EventType.WORKSHOP:
          color = "orange";
          break;
        case EventType.WEBINAR:
          color = "blue";
          break;
        case EventType.OTHER:
        default:
          color = "gray";
      }
      return <Badge className={`bg-${color}-500 text-white`}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<EventStatus>("status");
      let color: string;
      switch (status) {
        case EventStatus.UPCOMING:
          color = "yellow";
          break;
        case EventStatus.COMPLETED:
          color = "green";
          break;
        case EventStatus.CANCELLED:
          color = "red";
          break;
        default:
          color = "gray";
      }
      return <Badge className={`bg-${color}-500 text-white`}>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Badge>;
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const startDate = row.getValue<string>("start_date");
      return startDate ? format(new Date(startDate), "dd MMM yyyy") : "N/A";
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue<string>("end_date");
      return endDate ? format(new Date(endDate), "dd MMM yyyy") : "N/A";
    },
  },
  {
    accessorKey: "organizer_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Oragnizer Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "current_registration_count",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Registrations
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "feedback_score",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Feedback Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;

      async function handleDelete() {
        const response = await deleteEventAction(event.id);
        if (response.error) {
          toast.error(`Failed to delete event: ${response.error}`);
        } else {
          toast.success("Event deleted successfully");
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
            <DropdownMenuItem onClick={() => alert(`Edit event with ID: ${event.id}`)}>
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
