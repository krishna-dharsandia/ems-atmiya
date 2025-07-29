import EventForm from "@/components/section/master/events/EventForm";

// Example usage of EventForm component

// For creating a new event:
export function CreateEventPage() {
  return <EventForm />;
}

// For editing an existing event:
export function EditEventPage({ eventId }: { eventId: string }) {
  return <EventForm id={eventId} />;
}

// Example in a Next.js page component:
export default function ExamplePage({ params }: { params: { id?: string } }) {
  const { id } = params;

  return (
    <div>
      {id ? (
        // Edit mode - pass the event ID
        <EventForm id={id} />
      ) : (
        // Create mode - no ID passed
        <EventForm />
      )}
    </div>
  );
}
