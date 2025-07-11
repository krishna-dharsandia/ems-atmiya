"use client";

import { DataTable } from "@/components/global/data-table/DataTable";
import { columns, Departments } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { useEffect } from "react";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { CircleQuestionMark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/global/heading/Heading";
import { createDepartmentDialogAtom } from "@/store/form-dialog";

export default function Page() {
  const { data, isLoading, error } = useSWR<Departments[]>("/api/department", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const setCreateDialog = useSetAtom(createDepartmentDialogAtom);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/master" },
      { label: "Management", href: "/master/management" },
      { label: "Departments", href: "/master/management/departments" },
    ]);
  });

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Departments - ${data?.length || 0}`} description="Manage Departments Details" />

        <Button onClick={() => setCreateDialog((prev) => !prev)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      {!isLoading && data ? (
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
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
}
