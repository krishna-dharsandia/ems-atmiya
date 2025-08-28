import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

type MonthlyData = {
  month: string;
  users: number;
};

type EventHackathonData = {
  month: string;
  events: number;
  hackathons: number;
};

type Props = {
  userRegistrationTrend: MonthlyData[];
  eventHackathonTrend: EventHackathonData[];
};

export function MonthlyTrendCharts({ userRegistrationTrend, eventHackathonTrend }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* User Registration Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Registration Trend</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "var(--chart-1)",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={userRegistrationTrend}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Monthly registration statistics <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">New user registrations per month</div>
        </CardFooter>
      </Card>

      {/* Events & Hackathons Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Events & Hackathons</CardTitle>
          <CardDescription>Last 6 months activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              events: {
                label: "Events",
                color: "var(--chart-2)",
              },
              hackathons: {
                label: "Hackathons",
                color: "var(--chart-3)",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={eventHackathonTrend}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="hackathons"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Monthly activity trends <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Events and hackathons created per month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
