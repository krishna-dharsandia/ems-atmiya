"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/fetcher";
import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect } from "react";
import { KeyMetrics } from "../../components/section/admin/overview/KeyMetrics";
import { DistributionCharts } from "../../components/section/admin/overview/DistributionCharts";
import { EventCharts } from "../../components/section/admin/overview/EventCharts";
import { RecentActivity } from "../../components/section/admin/overview/RecentActivity";

type AdminOverviewData = {
  totalStudents: number;
  totalEvents: number;
  totalFeedback: number;
  totalRegistrations: number;
  totalAdmins: number;
  totalDepartments: number;
  totalPrograms: number;
  avgEventRating: number;
  departmentStats: { name: string; count: number }[];
  programStats: { name: string; count: number }[];
  upcomingEvents: number;
  completedEvents: number;
  topEvents: { name: string; current_registration_count: number }[];
  recentEvents: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    registration_required: boolean;
    current_registration_count: number;
  }[];
  recentRegistrations: {
    id: string;
    event: { name: string };
    user: { firstName: string; lastName: string };
    createdAt: string;
  }[];
  recentFeedback: {
    id: string;
    rating: number;
    comment: string;
    event: { name: string };
    user: { firstName: string; lastName: string };
    createdAt: string;
  }[];
};

export default function AdminOverview() {
  const { data, error } = useSWR<AdminOverviewData>("/api/admin/overview", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumbs([{ label: "Dashboard", href: "/admin" }]);
  });

  if (error) return <div className="p-8">Error loading data</div>;
  if (!data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="p-8 space-y-8">
      <KeyMetrics data={data} />
      <DistributionCharts departmentStats={data.departmentStats} programStats={data.programStats} />
      <EventCharts upcomingEvents={data.upcomingEvents} completedEvents={data.completedEvents} topEvents={data.topEvents} />
      <RecentActivity recentEvents={data.recentEvents} recentRegistrations={data.recentRegistrations} recentFeedback={data.recentFeedback} />
    </div>
  );
}
