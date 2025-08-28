import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, School, Star } from "lucide-react";

type Props = {
  data: {
    totalStudents: number;
    totalPrograms: number;
    avgEventRating: number;
  };
};

export function KeyMetrics({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription>All registered students</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.totalStudents}</span>
          <User className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Programs</CardTitle>
          <CardDescription>Academic programs</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.totalPrograms}</span>
          <School className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Avg. Event Rating</CardTitle>
          <CardDescription>Average feedback score</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.avgEventRating.toFixed(2)}</span>
          <Star className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
    </div>
  );
}
