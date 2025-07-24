import { z } from "zod";

export const onboardingStudentSchema = z.object({
  departmentId: z.string({ required_error: "Department ID is required" }).min(1, "Department ID is required"),
  programId: z.string({ required_error: "Program ID is required" }).min(1, "Program ID is required"),
  currentSemester: z.coerce
    .number({
      required_error: "Current semester is required",
      invalid_type_error: "Current semester must be a number"
    })
    .positive("Semester must be a positive number")
    .int("Semester must be an integer")
    .min(1, "Semester must be at least 1"),
  currentYear: z.coerce
    .number({
      required_error: "Current year is required",
      invalid_type_error: "Current year must be a number"
    })
    .positive("Year must be a positive number")
    .int("Year must be an integer")
    .min(1, "Year must be at least 1"),
  registrationNumber: z.string({ required_error: "Registration number is required" }).min(1, "Registration number is required"),
});

export type OnboardingStudentSchema = z.infer<typeof onboardingStudentSchema>;
