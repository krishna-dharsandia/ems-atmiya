import { z } from "zod";

export const hackathonSchema = z.object({
  name: z.string().min(1, "Hackathon name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  poster_url: z.string().optional(),
  location: z.string().optional(),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  start_time: z.date({
    required_error: "Start time is required",
  }),
  end_time: z.date({
    required_error: "End time is required",
  }),
  registration_start_date: z.date({
    required_error: "Registration start date is required",
  }),
  registration_end_date: z.date({
    required_error: "Registration end date is required",
  }),
  registration_limit: z.number().int().positive().optional(),
  mode: z.enum(["ONLINE", "OFFLINE"], {
    required_error: "Mode is required",
  }),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED", "OTHER"], {
    required_error: "Status is required",
  }),
  team_size_limit: z.number().int().positive().optional(),
  organizer_name: z.string().min(1, "Organizer name is required"),
  organizer_contact: z.string().optional(),
  problemStatements: z
    .array(
      z.object({
        code: z.string().min(1, "Problem code is required"),
        title: z.string().min(1, "Problem title is required"),
        description: z.string().min(10, "Problem description is required"),
      })
    )
    .optional(),
  rules: z.array(z.string()).optional(),
  evaluationCriteria: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Schema for processed form data with formatted fields
export const formattedHackathonSchema = hackathonSchema.extend({
  problemStatements: z.array(
    z.object({
      code: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  rules: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
  tags: z.array(z.string()),
});

export type HackathonSchema = z.infer<typeof hackathonSchema>;
export type FormattedHackathonSchema = z.infer<typeof formattedHackathonSchema>;
