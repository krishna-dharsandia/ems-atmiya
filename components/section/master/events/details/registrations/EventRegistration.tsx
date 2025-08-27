import { DataTable } from "@/components/global/data-table/DataTable";
import DataTableSkeleton from "@/components/global/data-table/DataTableSkeleton";
import { fetcher } from "@/fetcher";
import useSWR from "swr";
import { columns, EventRegistration } from "./columns";
import { CircleQuestionMark } from "lucide-react";
import { analyzeRegistrationData } from "@/utils/functions/exportUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function EventRegistrationTable({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR<EventRegistration[]>(
    `/api/events/details/registrations?id=${id}`,
    fetcher
  );

  if (error) return <p>Error: {error}</p>;

  // Analyze data for incomplete profiles
  const analysis = data ? analyzeRegistrationData(data as Record<string, unknown>[]) : null;

  return (
    <>
      {!isLoading && data ? (
        <>
          {analysis && analysis.incompleteProfiles > 0 && (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Data Quality Issue:</strong> {analysis.incompleteProfiles} out of {analysis.totalRegistrations} registrations have incomplete profiles.
                <br />
                <span className="text-sm">
                  Missing data: {analysis.missingDepartment} departments, {analysis.missingProgram} programs, {analysis.missingRegistrationNumber} registration numbers
                </span>
                <br />
                <span className="text-sm font-medium">
                  Recommendation: Users with incomplete profiles should complete their onboarding process to ensure accurate data in exports.
                </span>
              </AlertDescription>
            </Alert>
          )}
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
        </>
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
}
