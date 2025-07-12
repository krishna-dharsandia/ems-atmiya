import { z } from "zod";

export const adminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  departmentId: z.string().uuid("Department ID must be a valid UUID").optional(),
  programId: z.string().uuid("Program ID must be a valid UUID").optional(),
  position: z.string().min(2, "Position must be at least 2 characters"),
});

export type AdminSchema = z.infer<typeof adminSchema>;
