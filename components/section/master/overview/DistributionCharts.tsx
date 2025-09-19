import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { TrendingUp, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
  departmentStats: { name: string; count: number }[];
  eventTypeStats: { name: string; count: number }[];
};

export function DistributionCharts({ departmentStats, eventTypeStats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Students by Department Pie Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center flex-1">
              <CardTitle>Students by Department</CardTitle>
              <CardDescription>Distribution across all departments</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle>Department Distribution Details</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Student Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentStats.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
            Platform-wide distribution <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Showing all departments</div>
        </CardFooter>
      </Card>

      {/* Event Type Distribution Pie Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center flex-1">
              <CardTitle>Events by Type</CardTitle>
              <CardDescription>Distribution by event type</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle>Event Type Distribution Details</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-1">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead className="text-right">Event Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventTypeStats.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={eventTypeStats.map((type) => ({ name: type.name, value: type.count }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {eventTypeStats.map((type, idx) => (
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
  );
}
