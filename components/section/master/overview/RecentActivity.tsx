type Props = {
  recentEvents: {
    id: string;
    name: string;
    start_date: string;
    status: string;
    registration_required: boolean;
    current_registration_count: number;
    event_type: string;
    mode: string;
  }[];
  recentRegistrations: {
    id: string;
    event: { name: string };
    user: { firstName: string; lastName: string };
    createdAt: string;
  }[];
  recentFeedback: {
    id: string;
    rating: number;
    comment: string;
    event: { name: string };
    user: { firstName: string; lastName: string };
    createdAt: string;
  }[];
};

export function RecentActivity({ recentEvents, recentRegistrations, recentFeedback }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          <ul className="space-y-2">
            {recentEvents.map((ev) => (
              <li key={ev.id} className="p-3 rounded bg-muted">
                <span className="font-medium">{ev.name}</span> — {ev.status} — {new Date(ev.start_date).toLocaleDateString()}
                <br />
                <span className="text-sm text-muted-foreground">
                  {ev.event_type} • {ev.mode} • Registrations: {ev.current_registration_count}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
          <ul className="space-y-2">
            {recentRegistrations.map((reg) => (
              <li key={reg.id} className="p-3 rounded bg-muted">
                <span className="font-medium">
                  {reg.user.firstName} {reg.user.lastName}
                </span>{" "}
                registered for <span className="font-medium">{reg.event.name}</span> on {new Date(reg.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
        <ul className="space-y-2">
          {recentFeedback.map((fb) => (
            <li key={fb.id} className="p-3 rounded bg-muted">
              <span className="font-medium">
                {fb.user.firstName} {fb.user.lastName}
              </span>{" "}
              rated <span className="font-medium">{fb.event.name}</span>: <span className="font-bold">{fb.rating}</span>
              <br />
              <span className="italic">{fb.comment}</span> <span className="text-xs text-muted-foreground">({new Date(fb.createdAt).toLocaleDateString()})</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
