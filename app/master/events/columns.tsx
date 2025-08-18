"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventMode, EventStatus, EventType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Download, ExternalLink, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction } from "./actions";
import { navigate } from "@/utils/functions/navigate";

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
  qrCode?: string;
  qrCodeData?: string;
};

export const columns: ColumnDef<Event>[] = [{
  accessorKey: "slug",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto !p-0 justify-start gap-0"
    >
      <span>Slug</span>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  size: 120,
  minSize: 100,
  maxSize: 150,
  cell: ({ row }) => {
    const slug = row.getValue("slug") as string;
    return (
      <div
        className="text-left font-medium text-sm max-w-[120px] truncate cursor-help"
        title={slug}
      >
        {slug}
      </div>
    );
  },
}, {
  accessorKey: "name",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto !p-0 justify-start"
    >
      Name
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  size: 180,
  minSize: 150,
  maxSize: 220,
  cell: ({ row }) => {
    const name = row.getValue("name") as string;
    return (
      <div
        className="text-left font-semibold text-sm max-w-[180px] truncate cursor-help"
        title={name}
      >
        {name}
      </div>
    );
  },
}, {
  accessorKey: "mode",
  header: "Mode",
  size: 100,
  minSize: 80,
  maxSize: 120,
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
    return (
      <div className="text-left">
        <Badge className={`bg-${color}-500 text-white text-xs`}>
          {mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()}
        </Badge>
      </div>
    );
  },
},
{
  accessorKey: "event_type",
  header: "Type",
  size: 120,
  minSize: 100,
  maxSize: 150,
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
    return (
      <div className="text-left">
        <Badge className={`bg-${color}-500 text-white text-xs`}>
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </Badge>
      </div>
    );
  },
},
{
  accessorKey: "status",
  header: "Status",
  size: 120,
  minSize: 100,
  maxSize: 150,
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
    return (
      <div className="text-left">
        <Badge className={`bg-${color}-500 text-white text-xs`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      </div>
    );
  },
}, {
  accessorKey: "start_date",
  header: "Start",
  size: 100,
  minSize: 90,
  maxSize: 120,
  cell: ({ row }) => {
    const startDate = row.getValue<string>("start_date");
    return (
      <div className="text-left text-sm">
        {startDate ? format(new Date(startDate), "dd MMM yyyy") : "N/A"}
      </div>
    );
  },
},
{
  accessorKey: "end_date",
  header: "End",
  size: 100,
  minSize: 90,
  maxSize: 120,
  cell: ({ row }) => {
    const endDate = row.getValue<string>("end_date");
    return (
      <div className="text-left text-sm">
        {endDate ? format(new Date(endDate), "dd MMM yyyy") : "N/A"}
      </div>
    );
  },
}, {
  accessorKey: "organizer_name",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto !p-0 justify-start"
    >
      Organizer
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  size: 140,
  minSize: 120,
  maxSize: 180,
  cell: ({ row }) => {
    const organizerName = row.getValue("organizer_name") as string;
    return (
      <div
        className="text-left text-sm max-w-[140px] truncate cursor-help"
        title={organizerName}
      >
        {organizerName}
      </div>
    );
  },
}, {
  accessorKey: "current_registration_count",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto !p-0 justify-start"
    >
      Regs
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  size: 80,
  minSize: 70,
  maxSize: 100,
  cell: ({ row }) => (
    <div className="text-left text-sm font-medium">
      {row.getValue("current_registration_count")}
    </div>
  ),
},
{
  accessorKey: "feedback_score",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto !p-0 justify-start"
    >
      Score
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  size: 80,
  minSize: 70,
  maxSize: 100,
  cell: ({ row }) => {
    const score = row.getValue<number>("feedback_score");
    return (
      <div className="text-left text-sm">
        {score ? score.toFixed(1) : "N/A"}
      </div>
    );
  },
}, {
  id: "actions",
  header: "Actions",
  size: 80,
  minSize: 80,
  maxSize: 120,
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

    async function handleEdit() {
      navigate(`/master/events/edit/${event.id}`);
    }

    async function handleDownloadQR() {
      try {
        let qrCodeBase64 = event.qrCode;

        // If QR code doesn't exist, generate it
        if (!qrCodeBase64) {
          toast.loading("Generating QR code...");

          const response = await fetch(`/api/events/${event.id}/qr-code`, {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Failed to generate QR code');
          }

          const data = await response.json();
          qrCodeBase64 = data.qrCode;
          toast.dismiss();
        }

        // Create a downloadable link for the QR code
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${qrCodeBase64}`;
        link.download = `${event.slug}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("QR code downloaded successfully");
      } catch (error) {
        console.error("Error downloading QR code:", error);
        toast.dismiss();
        toast.error("Failed to download QR code");
      }
    }

    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/master/events/details/${event.id}`)}
            >
              <ExternalLink /> Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/events/${event.id}`)}>
              <Eye /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadQR}>
              <Download /> Download QR
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              <Trash2 color="red" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
},
];
