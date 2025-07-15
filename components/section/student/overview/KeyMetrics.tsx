import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarCheck2, MessageSquare, BookOpen } from "lucide-react";

interface Props {
  data: {
    totalEventsAttended: number;
    feedbackGiven: number;
    upcomingEvents: number;
    department?: string;
    program?: string;
    currentSemester?: number;
    currentYear?: number;
  };
}

export function StudentKeyMetrics({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Events Attended</CardTitle>
          <CardDescription>Events you participated in</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.totalEventsAttended}</span>
          <CalendarCheck2 className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Feedback Given</CardTitle>
          <CardDescription>Your feedback submissions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.feedbackGiven}</span>
          <MessageSquare className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
      <Card className="pt-6 pb-0 group">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you registered for</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">{data.upcomingEvents}</span>
          <BookOpen className="text-primary/30 group-hover:text-primary/60 transition-colors" size={90} />
        </CardContent>
      </Card>
    </div>
  );
}
