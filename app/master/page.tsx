"use client";

import useSWR from "swr";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Cell, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/fetcher";

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
  const { data, error } = useSWR<MasterOverviewData>("/api/master/overview", fetcher);

  if (error) return <div className="p-8">Error loading data: {error.message}</div>;
  if (!data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Master Dashboard Overview</h1>
      <p className="text-muted-foreground mb-8">Platform-wide insights and analytics for the entire system.</p>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>All registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalStudents}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
            <CardDescription>Events created</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalEvents}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
            <CardDescription>Feedback received</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalFeedback}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Registrations</CardTitle>
            <CardDescription>Event registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalRegistrations}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Admins</CardTitle>
            <CardDescription>Admins in system</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalAdmins}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Masters</CardTitle>
            <CardDescription>Masters in system</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalMasters}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Active departments</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.totalDepartments}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Event Rating</CardTitle>
            <CardDescription>Average feedback score</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-primary">{data.avgEventRating.toFixed(2)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Students by Department Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Students by Department</CardTitle>
            <CardDescription>Distribution across all departments</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={data.departmentStats.map((dep) => ({ name: dep.name, value: dep.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.departmentStats.map((dep, idx) => (
                    <Cell key={dep.name} fill={`var(--chart-${(idx % 5) + 1})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Platform-wide distribution <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">Showing all departments</div>
          </CardFooter>
        </Card>

        {/* Event Type Distribution Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Events by Type</CardTitle>
            <CardDescription>Distribution by event type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={data.eventTypeStats.map((type) => ({ name: type.name, value: type.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.eventTypeStats.map((type, idx) => (
                    <Cell key={type.name} fill={`var(--chart-${(idx % 5) + 1})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Event type breakdown <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">All event types</div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Event Status Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Event Status Overview</CardTitle>
            <CardDescription>Events by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                events: {
                  label: "Events",
                  color: "var(--chart-1)",
                },
              }}
            >
              <BarChart
                data={[
                  { status: "Upcoming", events: data.upcomingEvents },
                  { status: "Completed", events: data.completedEvents },
                  { status: "Cancelled", events: data.cancelledEvents },
                ]}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="events" fill="var(--chart-1)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Event status distribution <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">All events across platform</div>
          </CardFooter>
        </Card>

        {/* User Role Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Platform user distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "var(--chart-2)",
                },
              }}
            >
              <BarChart data={data.userRoleStats.map((role) => ({ role: role.name, users: role.count }))}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="role" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="users" fill="var(--chart-2)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              User role breakdown <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">All platform users</div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          <ul className="space-y-2">
            {data.recentEvents.map((ev) => (
              <li key={ev.id} className="p-3 rounded bg-muted">
                <span className="font-medium">{ev.name}</span> — {ev.status} — {new Date(ev.start_date).toLocaleDateString()}
                <br />
                <span className="text-sm text-muted-foreground">
                  {ev.event_type} • {ev.mode} • Registrations: {ev.current_registration_count}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
          <ul className="space-y-2">
            {data.recentRegistrations.map((reg) => (
              <li key={reg.id} className="p-3 rounded bg-muted">
                <span className="font-medium">
                  {reg.user.firstName} {reg.user.lastName}
                </span>{" "}
                registered for <span className="font-medium">{reg.event.name}</span> on {new Date(reg.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
        <ul className="space-y-2">
          {data.recentFeedback.map((fb) => (
            <li key={fb.id} className="p-3 rounded bg-muted">
              <span className="font-medium">
                {fb.user.firstName} {fb.user.lastName}
              </span>{" "}
              rated <span className="font-medium">{fb.event.name}</span>: <span className="font-bold">{fb.rating}</span>
              <br />
              <span className="italic">{fb.comment}</span> <span className="text-xs text-muted-foreground">({new Date(fb.createdAt).toLocaleDateString()})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
