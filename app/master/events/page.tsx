"use client";

import { DataTable } from "@/components/global/data-table/DataTable";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { Heading } from "@/components/global/heading/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetcher } from "@/fetcher";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { CircleQuestionMark, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { columns, Event } from "./columns";

export default function Page() {
  const { data, isLoading, error } = useSWR<Event[]>(
    "/api/master/events",
    fetcher
  );
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const router = useRouter();

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
    ]);
  }, [setCurrentBreadcrumbs]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex items-start justify-between">
        <Heading
          title={`Events - ${data?.length || 0}`}
          description="Manage Events Details"
        />
        <Button
          onClick={() => router.push("/master/events/create")}
          className="mb-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Event
        </Button>
      </div>

      <Separator />

      {!isLoading && data ? (
        <DataTable
          data={data}
          columns={columns}
          search={{ column: "name", placeholder: "Search Event" }}
          noData={{
            icon: <CircleQuestionMark size={40} />,
            title: "No results found",
            description: "There are no events matching your search criteria.",
          }}
        />
      ) : (
        <DataTableSkeleton />
      )}
    </div>
  );
}
