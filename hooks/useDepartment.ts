import useSWR from "swr";
import { fetcher } from "@/fetcher";
import { Department, Student, Program, Admin } from "@prisma/client";

export function useDepartment() {
  type DepartmentWithRelations = Department & {
    students?: Student[];
    programs?: Program[];
    admins?: Admin[];
  };

  const { data, error, isLoading } = useSWR<DepartmentWithRelations[]>("/api/department", fetcher);

  return {
    departments: data || [],
    isLoading,
    isError: error,
  };
}
