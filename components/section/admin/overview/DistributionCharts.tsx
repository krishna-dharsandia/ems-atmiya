import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
  departmentStats: { name: string; count: number }[];
  programStats: { name: string; count: number }[];
};

export function DistributionCharts({ departmentStats, programStats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Students by Department Pie Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Students by Department</CardTitle>
          <CardDescription>Distribution of students</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={departmentStats.map((dep) => ({ name: dep.name, value: dep.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {departmentStats.map((dep, idx) => (
                  <Cell key={dep.name} fill={`var(--chart-${(idx % 5) + 1})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Trending up by 2.1% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Showing student distribution by department</div>
        </CardFooter>
      </Card>

      {/* Students by Program Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Students by Program</CardTitle>
          <CardDescription>Distribution of students</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              students: {
                label: "Students",
                color: "var(--chart-1)",
              },
            }}
          >
            <BarChart data={programStats.map((prog) => ({ program: prog.name, students: prog.count }))}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="program" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 10)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="students" fill="var(--chart-1)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 1.7% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Showing student distribution by program</div>
        </CardFooter>
      </Card>
    </div>
  );
}
