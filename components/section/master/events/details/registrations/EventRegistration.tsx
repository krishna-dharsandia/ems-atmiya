import { DataTable } from "@/components/global/data-table/DataTable";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { fetcher } from "@/fetcher";
import useSWR from "swr";
import { columns, EventRegistration } from "./columns";
import { CircleQuestionMark } from "lucide-react";

export function EventRegistrationTable({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR<EventRegistration[]>(
    `/api/events/details/registrations?id=${id}`,
    fetcher
  );

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {!isLoading && data ? (
        <DataTable
          columns={columns}
          data={data}
          noData={{
            icon: <CircleQuestionMark size={40} />,
            title: "No results found",
            description:
              "There are no event registrations matching your search criteria.",
          }}
        />
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
}
