export interface EventWithDetails {
  id: string;
  slug: string;
  name: string;
  description: string;
  key_highlights: string[];
  note?: string;
  poster_url: string;
  mode: "ONLINE" | "OFFLINE";
  address?: string;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  event_type: "SESSION" | "WORKSHOP" | "WEBINAR" | "OTHER";
  status: "UPCOMING" | "COMPLETED" | "CANCELLED" | "OTHER";
  registration_required: boolean;
  registration_link?: string;
  registration_limit?: number;
  recording_link?: string;
  feedback_form_link?: string;
  tags: string[];
  organizer_name: string;
  organizer_contact?: string;
  is_paid: boolean;
  ticket_price?: number;
  speakers: {
    id: string;
    name: string;
    bio?: string;
    photo_url?: string;
  }[];
  created_by: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export async function fetchEventById(
  id: string
): Promise<EventWithDetails | null> {
  try {
    const response = await fetch(`/api/events/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    const event = await response.json();
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}
