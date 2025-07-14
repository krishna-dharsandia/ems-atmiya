import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/fetcher";

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

  if (error) return <div className="p-8">Error loading data</div>;
  if (!data) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Students">{data.totalStudents}</Card>
        <Card title="Total Events">{data.totalEvents}</Card>
        <Card title="Total Feedback">{data.totalFeedback}</Card>
        <Card title="Total Registrations">{data.totalRegistrations}</Card>
        <Card title="Total Admins">{data.totalAdmins}</Card>
        <Card title="Departments">{data.totalDepartments}</Card>
        <Card title="Programs">{data.totalPrograms}</Card>
        <Card title="Avg. Event Rating">{data.avgEventRating.toFixed(2)}</Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Chart
          title="Students by Department"
          type="pie"
          data={data.departmentStats.map((dep: { name: string; count: number }) => dep.count)}
          labels={data.departmentStats.map((dep: { name: string; count: number }) => dep.name)}
        />
        <Chart
          title="Students by Program"
          type="bar"
          data={data.programStats.map((prog: { name: string; count: number }) => prog.count)}
          labels={data.programStats.map((prog: { name: string; count: number }) => prog.name)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Chart title="Upcoming vs Completed Events" type="bar" data={[data.upcomingEvents, data.completedEvents]} labels={["Upcoming", "Completed"]} />
        <Chart
          title="Top Events by Registration"
          type="bar"
          data={data.topEvents.map((ev: { name: string; current_registration_count: number }) => ev.current_registration_count)}
          labels={data.topEvents.map((ev: { name: string }) => ev.name)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          <ul className="space-y-2">
            {data.recentEvents.map((ev) => (
              <li key={ev.id} className="p-3 rounded bg-muted">
                <span className="font-medium">{ev.name}</span> — {ev.status} — {new Date(ev.start_date).toLocaleDateString()}
                <br />
                Registrations: {ev.current_registration_count}
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
