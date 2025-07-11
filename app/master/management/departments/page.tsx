"use client";

import { DataTable } from "@/components/global/data-table/DataTable";
import { columns, Departments } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { useEffect } from "react";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { CircleQuestionMark } from "lucide-react";

export default function Page() {
  const { data, isLoading, error } = useSWR<Departments[]>("/api/department", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/master" },
      { label: "Management", href: "/master/management" },
      { label: "Departments", href: "/master/management/departments" },
    ]);
  });

  if (isLoading || !data) return <DataTableSkeleton />;

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        search={{ column: "name", placeholder: "Search Department" }}
        noData={{
          icon: <CircleQuestionMark size={40} />,
          title: "No results found",
          description: "There are no departments matching your search criteria.",
        }}
      />
    </>
  );
}
