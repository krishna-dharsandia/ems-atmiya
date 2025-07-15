import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  userRoleStats: { name: string; count: number }[];
};

export function EventCharts({ upcomingEvents, completedEvents, cancelledEvents, userRoleStats }: Props) {
  return (
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
                { status: "Upcoming", events: upcomingEvents },
                { status: "Completed", events: completedEvents },
                { status: "Cancelled", events: cancelledEvents },
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
            <BarChart data={userRoleStats.map((role) => ({ role: role.name, users: role.count }))}>
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
  );
}
