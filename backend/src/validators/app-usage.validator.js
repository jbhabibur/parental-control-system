import { z } from "zod";

export const createAppUsageSchema = z
  .object({
    appIdentifier: z.string().trim().min(1).max(255),

    startedAt: z.coerce.date(),

    endedAt: z.coerce.date().nullable().optional(),

    durationSeconds: z.number().int().min(0).optional(),
  })
  .refine((data) => !data.endedAt || data.endedAt >= data.startedAt, {
    message: "End time cannot be earlier than start time",
    path: ["endedAt"],
  });
