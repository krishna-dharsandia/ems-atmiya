import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Event {
  event: {
    id: string;
    name: string;
    end_date?: string;
    event_type: string;
    mode: string;
  };
}

interface Props {
  completedEvents: Event[];
}

export function StudentCompletedEvents({ completedEvents }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Completed Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {completedEvents.map((ev) => (
            <li key={ev.event.id} className="p-3 rounded bg-muted">
              <span className="font-medium">{ev.event.name}</span> — {ev.event.end_date ? new Date(ev.event.end_date).toLocaleDateString() : ""}
              <br />
              <span className="text-sm text-muted-foreground">
                {ev.event.event_type} • {ev.event.mode}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
