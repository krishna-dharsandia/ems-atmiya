"use client";

import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/fetcher";
import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect, useState } from "react";
import { KeyMetrics } from "../../components/section/admin/overview/KeyMetrics";
import { DistributionCharts } from "../../components/section/admin/overview/DistributionCharts";
import { EventCharts } from "../../components/section/admin/overview/EventCharts";
import { RecentActivity } from "../../components/section/admin/overview/RecentActivity";
import { Separator } from "@/components/ui/separator";
import { ChartArea } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/global/heading/Heading";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const { data, error, isLoading } = useSWR<AdminOverviewData>("/api/admin/overview", fetcher);
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error && !user) {
        toast.error("Failed to fetch user data");
        return;
      }
      setUser(user);
    }

    setCurrentBreadcrumbs([{ label: "Dashboard", href: "/master" }]);
    checkUser();
  });

  useEffect(() => {
    setCurrentBreadcrumbs([{ label: "Dashboard", href: "/admin" }]);
  });

  if (error) return <div className="p-8">Error loading data</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <Heading title={`Welcome Back - ${user?.user_metadata.full_name}`} description="Platform-wide insights and analytics for the entire system." />
        <Button className="mb-4">
          <ChartArea className="mr-2 h-4 w-4" /> More Insights
        </Button>
      </div>

      <Separator className="mb-8" />

      {!isLoading && data ? (
        <div className="p-8 space-y-8">
          <KeyMetrics data={data} />
          <DistributionCharts departmentStats={data.departmentStats} programStats={data.programStats} />
          <EventCharts upcomingEvents={data.upcomingEvents} completedEvents={data.completedEvents} topEvents={data.topEvents} />
          <RecentActivity recentEvents={data.recentEvents} recentRegistrations={data.recentRegistrations} recentFeedback={data.recentFeedback} />
        </div>
      ) : (
        <div className="p-8">
          <Skeleton className="h-96 w-full" />
        </div>
      )}
    </div>
  );
}
