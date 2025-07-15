import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Event {
  event: {
    id: string;
    name: string;
    start_date: string;
    end_date?: string;
    event_type: string;
    mode: string;
  };
}
interface Feedback {
  id: string;
  rating: number;
  comment: string;
  event: { name: string };
  createdAt: string;
}

interface Props {
  upcomingEvents: Event[];
  completedEvents: Event[];
  recentFeedback: Feedback[];
}

export function StudentRecentActivity({ upcomingEvents, recentFeedback }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Registered Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {upcomingEvents.map((ev) => (
              <li key={ev.event.id} className="p-3 rounded bg-muted">
                <span className="font-medium">{ev.event.name}</span> — {new Date(ev.event.start_date).toLocaleDateString()}
                <br />
                <span className="text-sm text-muted-foreground">
                  {ev.event.event_type} • {ev.event.mode}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentFeedback.map((fb) => (
              <li key={fb.id} className="p-3 rounded bg-muted">
                <span className="font-medium">{fb.event.name}</span>: <span className="font-bold">{fb.rating}</span>
                <br />
                <span className="italic">{fb.comment}</span> <span className="text-xs text-muted-foreground">({new Date(fb.createdAt).toLocaleDateString()})</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
