import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  faculty: z.string().min(2, "Faculty name must be at least 2 characters"),
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;
