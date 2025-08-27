import { z } from "zod";

export const eventSpeakerSchema = z.object({
  name: z.string().min(2, "Speaker name must be at least 2 characters"),
  bio: z.string().optional(),
  photo_url: z.string().optional(), // Remove URL validation for optional field
});

export const eventSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    name: z.string().min(2, "Event name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    key_highlights: z.array(z.string()).min(1, "At least one key highlight is required"),
    note: z.string().optional(),
    poster_url: z.string().optional(),
    speakers: z.array(eventSpeakerSchema).default([]),
    mode: z.enum(["ONLINE", "OFFLINE"], { required_error: "Mode is required" }),
    address: z.string().optional(),
    start_date: z.date({ required_error: "Start date is required" }),
    end_date: z.date().optional(),
    start_time: z.date({ required_error: "Start time is required" }),
    end_time: z.date().optional(),
    event_type: z.enum(["SESSION", "WORKSHOP", "WEBINAR", "OTHER"], { required_error: "Event type is required" }),
    status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED", "OTHER"], { required_error: "Status is required" }),
    registration_required: z.boolean().default(false),
    registration_link: z.string().optional(),
    registration_limit: z.number().int().positive("Registration limit must be a positive number").optional(),
    recording_link: z
      .string()
      .optional()
      .refine((val) => !val || z.string().url().safeParse(val).success, "Must be a valid URL"),
    feedback_form_link: z
      .string()
      .optional()
      .refine((val) => !val || z.string().url().safeParse(val).success, "Must be a valid URL"),
    tags: z.array(z.string()).default([]),
    organizer_name: z.string().min(2, "Organizer name must be at least 2 characters"),
    organizer_contact: z.string().optional(),
    is_paid: z.boolean().default(false),
    ticket_price: z.number().int().nonnegative("Ticket price must be non-negative").optional(),
  })
  .refine(
    (data) => {
      // If event is offline, address is required
      if (data.mode === "OFFLINE" && !data.address) {
        return false;
      }
      // If event is paid, ticket price is required
      if (data.is_paid && !data.ticket_price) {
        return false;
      }
      // End date should be after start date if provided
      if (data.end_date && data.start_date && data.end_date < data.start_date) {
        return false;
      }
      // End time should be after start time if provided
      if (data.end_time && data.start_time && data.end_time < data.start_time) {
        return false;
      }
      return true;
    },
    {
      message: "Invalid event configuration",
      path: [],
    }
  );

export type EventSchema = z.infer<typeof eventSchema>;
export type EventSpeakerSchema = z.infer<typeof eventSpeakerSchema>;

export const formattedEventSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  description: z.string().min(10),
  key_highlights: z.array(z.string().min(1)),
  note: z.string().optional(),
  poster_url: z.string().optional(),
  speakers: z.array(
    z.object({
      name: z.string().min(1),
      bio: z.string().optional(),
      photo_url: z.string().optional(),
    })
  ),
  mode: z.enum(["ONLINE", "OFFLINE"]),
  address: z.string().optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
  start_time: z.date(),
  end_time: z.date().optional(),
  event_type: z.enum(["SESSION", "WORKSHOP", "WEBINAR", "OTHER"]),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED", "OTHER"]),
  registration_required: z.boolean(),
  registration_link: z.string().url().optional(),
  registration_limit: z.number().int().positive().optional(),
  recording_link: z.string().url().optional(),
  feedback_form_link: z.string().url().optional(),
  tags: z.array(z.string()),
  organizer_name: z.string().min(2),
  organizer_contact: z.string().optional(),
  is_paid: z.boolean(),
  ticket_price: z.number().int().nonnegative().optional(),
});

export type FormattedEventSchema = z.infer<typeof formattedEventSchema>;

export const eventFeedbackSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().optional(),
});

export type EventFeedbackSchema = z.infer<typeof eventFeedbackSchema>;
