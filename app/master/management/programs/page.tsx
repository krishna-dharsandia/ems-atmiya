"use client";

import { DataTable } from "@/components/global/data-table/DataTable";
import { columns, Programs } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { useEffect } from "react";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { CircleQuestionMark } from "lucide-react";

export default function Page() {
  const { data, isLoading, error } = useSWR<Programs[]>("/api/program", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/master" },
      { label: "Management", href: "/master/management" },
      { label: "Programs", href: "/master/management/programs" },
    ]);
  });

  if (isLoading || !data) return <DataTableSkeleton />;

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        search={{ column: "name", placeholder: "Search Program" }}
        noData={{
          icon: <CircleQuestionMark size={40} />,
          title: "No results found",
          description: "There are no programs matching your search criteria.",
        }}
      />
    </>
  );
}
