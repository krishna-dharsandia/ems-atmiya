import { z } from "zod";

export const updatePasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
