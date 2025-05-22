import { z } from "zod";

export const authWebhookBodySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  token: z.string(),
});

export type AuthWebhookBodySchema = z.infer<typeof authWebhookBodySchema>;
