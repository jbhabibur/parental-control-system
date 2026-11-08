import { z } from "zod";

// ========== Create Remote Command (PARENT) ==========
export const createRemoteCommandSchema = z
  .object({
    commandType: z.enum(["LOCK", "UNLOCK", "PAUSE", "RESUME", "SYNC_POLICY"]),

    payload: z.record(z.string(), z.unknown()).nullable().optional(),

    expiresAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => !data.expiresAt || data.expiresAt > new Date(), {
    message: "Expiry time must be in the future",
    path: ["expiresAt"],
  });

// ========== Update Command Status (CHILD DEVICE) ==========
export const updateCommandStatusSchema = z.object({
  status: z.enum(["SENT", "ACKNOWLEDGED", "FAILED"]),
});
