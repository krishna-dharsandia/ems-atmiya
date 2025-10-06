import { z } from "zod";

export const markAttendanceSchema = z.object({
  sheduleId: z.string().min(1, "Schedule ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  teamId: z.string().min(1, "Team ID is required"),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
