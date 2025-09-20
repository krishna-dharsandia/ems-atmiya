import { z } from "zod";

export const editTeamSchema = z.object({
  id: z.string().min(1),
  mentor: z.string().min(1, "Mentor name is required"),
  mentor_mail: z.string().email("Invalid email address"),
  disqualified: z.boolean(),
  problemStatementId: z.string().optional().nullable(),
  teamName: z.string().min(1, "Team name is required"),
  leaderId: z.string().optional().nullable(),
  members: z.array(
    z.object({
      id: z.string(),
      studentId: z.string(),
      attended: z.boolean().optional(),
      student: z.any().optional(), // for display only
    })
  ).min(1, "At least one member is required"),
});

export type EditTeamInput = z.infer<typeof editTeamSchema>;
