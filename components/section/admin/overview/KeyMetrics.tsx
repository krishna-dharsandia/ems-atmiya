import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, CalendarCheck2, MessageSquare, ClipboardList, ShieldCheck, Building2, Layers, Star } from "lucide-react";

type Props = {
  data: {
    totalStudents: number;
    totalEvents: number;
    totalFeedback: number;
    totalRegistrations: number;
    totalAdmins: number;
    totalDepartments: number;
    totalPrograms: number;
    avgEventRating: number;
  };
};

export function KeyMetrics({ data }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription>Registered students</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalStudents}</span>
          <User className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Events</CardTitle>
          <CardDescription>Events created</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalEvents}</span>
          <CalendarCheck2 className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Feedback</CardTitle>
          <CardDescription>Feedback received</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalFeedback}</span>
          <MessageSquare className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Registrations</CardTitle>
          <CardDescription>Event registrations</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalRegistrations}</span>
          <ClipboardList className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Total Admins</CardTitle>
          <CardDescription>Admins in system</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalAdmins}</span>
          <ShieldCheck className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Active departments</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalDepartments}</span>
          <Building2 className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>Active programs</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.totalPrograms}</span>
          <Layers className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Avg. Event Rating</CardTitle>
          <CardDescription>Average feedback score</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <span className="text-3xl font-bold text-primary">{data.avgEventRating.toFixed(2)}</span>
          <Star className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
    </div>
  );
}
