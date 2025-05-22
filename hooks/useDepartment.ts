import useSWR from "swr";
import {fetcher} from "@/fetcher";

export type Department = {
    id: number;
    name: string;
}

export function useDepartment() {
    const { data,error,isLoading } = useSWR<Department>("/api/department", fetcher);

    return {
        departments: data,
        isLoading,
        isError: error,
    }
}