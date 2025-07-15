"use client";

import useSWR from "swr";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, XAxis, Cell, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartArea, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/fetcher";
import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Heading } from "@/components/global/heading/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyMetrics } from "@/components/section/master/overview/KeyMetrics";
import { DistributionCharts } from "@/components/section/master/overview/DistributionCharts";
import { EventCharts } from "@/components/section/master/overview/EventCharts";
import { RecentActivity } from "@/components/section/master/overview/RecentActivity";

type MasterOverviewData = {
  totalStudents: number;
  totalEvents: number;
  totalFeedback: number;
  totalRegistrations: number;
  totalAdmins: number;
  totalMasters: number;
  totalDepartments: number;
  totalPrograms: number;
  avgEventRating: number;
  departmentStats: { name: string; count: number }[];
  programStats: { name: string; count: number }[];
  eventTypeStats: { name: string; count: number }[];
  eventModeStats: { name: string; count: number }[];
  userRoleStats: { name: string; count: number }[];
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  topEvents: { name: string; current_registration_count: number }[];
  recentEvents: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    registration_required: boolean;
    current_registration_count: number;
    event_type: string;
    mode: string;
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

export default function MasterOverview() {
  const { data, error, isLoading } = useSWR<MasterOverviewData>("/api/master/overview", fetcher);
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

  if (error) {
    return <div className="p-8">Error loading data: {error.message}</div>;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Welcome Back - ${user?.user_metadata.full_name}`} description="Platform-wide insights and analytics for the entire system." />
        <Button className="mb-4">
          <ChartArea className="mr-2 h-4 w-4" /> More Insights
        </Button>
      </div>

      <Separator />

      {!isLoading && data ? (
        <div className="w-full space-y-8">
          <KeyMetrics data={data} />
          <DistributionCharts departmentStats={data.departmentStats} eventTypeStats={data.eventTypeStats} />
          <EventCharts upcomingEvents={data.upcomingEvents} completedEvents={data.completedEvents} cancelledEvents={data.cancelledEvents} userRoleStats={data.userRoleStats} />
          <RecentActivity recentEvents={data.recentEvents} recentRegistrations={data.recentRegistrations} recentFeedback={data.recentFeedback} />
        </div>
      ) : (
        <div className="p-8">
          <Skeleton className="h-96 w-full" />
        </div>
      )}
    </>
  );
}
