import { DataTable } from "@/components/global/data-table/DataTable";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { fetcher } from "@/fetcher";
import useSWR from "swr";
import { columns, EventFeedback } from "./columns";
import { CircleQuestionMark } from "lucide-react";

export function EventFeedbackTable({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR<EventFeedback[]>(
    `/api/events/details/feedbacks?id=${id}`,
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
              "There are no event feedbacks matching your search criteria.",
          }}
        />
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
}
