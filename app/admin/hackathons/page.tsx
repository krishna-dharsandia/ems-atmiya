"use client";

import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/global/heading/Heading";
import { DataTable } from "@/components/global/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarRange, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Hackathon {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function AdminHackathons() {
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const router = useRouter();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  };

  const { data, error, isLoading } = useSWR<any>(`/api/hackathons`, fetcher);

  useEffect(() => {
    if (data && data.hackathons) {
      setHackathons(data.hackathons);
    }
  }, [data]);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/admin" },
      { label: "Hackathons", href: "/admin/hackathons" },
    ]);
  }, [setCurrentBreadcrumbs]);

  const columns: ColumnDef<Hackathon>[] = [
    {
      accessorKey: "name",
      header: "Hackathon Name",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const start = new Date(row.original.start_date);
        const end = new Date(row.original.end_date);
        return (
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>
              {format(start, "MMM d")} - {format(end, "MMM d, yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                status === "UPCOMING"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : status === "COMPLETED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {status.toLowerCase()}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const hackathon = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/admin/hackathons/${hackathon.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <Heading
          title="Hackathons"
          description="Manage hackathon events and attendance."
        />
      </div>
      <Separator className="mb-8" />

      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          Error loading hackathons
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No hackathons found
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={hackathons}
          search={{
            column: "name",
            placeholder: "Search hackathons...",
          }}
        />
      )}
    </div>
  );
}
