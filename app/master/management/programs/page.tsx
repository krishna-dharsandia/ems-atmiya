"use client";

import { DataTable } from "@/components/global/data-table/DataTable";
import { columns, Programs } from "./columns";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { useEffect } from "react";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { CircleQuestionMark, Plus } from "lucide-react";
import { createProgramDialogAtom } from "@/store/form-dialog";
import { Heading } from "@/components/global/heading/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const { data, isLoading, error } = useSWR<Programs[]>("/api/program", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const setCreateDialog = useSetAtom(createProgramDialogAtom);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/master" },
      { label: "Management", href: "/master/management" },
      { label: "Programs", href: "/master/management/programs" },
    ]);
  });

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Programs - ${data?.length || 0}`} description="Manage Programs Details" />
        <Button onClick={() => setCreateDialog((prev) => !prev)} className="mb-4">
          <Plus className="mr-2 h-4 w-4" /> Add New Program
        </Button>
      </div>

      <Separator />

      {!isLoading && data ? (
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
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
}
