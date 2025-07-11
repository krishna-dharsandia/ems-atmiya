import { z } from "zod";

export const programSchema = z.object({
  name: z.string().min(2, "Program name must be at least 2 characters"),
  departmentId: z.string().uuid("Department ID must be a valid UUID"),
});

export type ProgramSchema = z.infer<typeof programSchema>;
