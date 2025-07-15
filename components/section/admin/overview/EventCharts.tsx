import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
  upcomingEvents: number;
  completedEvents: number;
  topEvents: { name: string; current_registration_count: number }[];
};

export function EventCharts({ upcomingEvents, completedEvents, topEvents }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Upcoming vs Completed Events Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming vs Completed Events</CardTitle>
          <CardDescription>Event status overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              upcoming: {
                label: "Upcoming",
                color: "var(--chart-1)",
              },
              completed: {
                label: "Completed",
                color: "var(--chart-2)",
              },
            }}
          >
            <BarChart
              data={[
                { status: "Upcoming", upcoming: upcomingEvents },
                { status: "Completed", completed: completedEvents },
              ]}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="upcoming" fill="var(--chart-1)" radius={8} />
              <Bar dataKey="completed" fill="var(--chart-2)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            +12 events completed <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Event status for the current period</div>
        </CardFooter>
      </Card>

      {/* Top Events by Registration Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Events by Registration</CardTitle>
          <CardDescription>Most popular events</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              registrations: {
                label: "Registrations",
                color: "var(--chart-1)",
              },
            }}
          >
            <BarChart data={topEvents.map((ev) => ({ event: ev.name, registrations: ev.current_registration_count }))}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="event" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 10)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="registrations" fill="var(--chart-1)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Most registered events <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Showing top events by registration count</div>
        </CardFooter>
      </Card>
    </div>
  );
}
