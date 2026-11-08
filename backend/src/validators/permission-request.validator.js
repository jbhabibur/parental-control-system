import { z } from "zod";

export const createPermissionRequestSchema = z.object({
  requestType: z.enum([
    "HARDWARE_PERMISSION",
    "APPLICATION_ACCESS",
    "DOMAIN_ACCESS",
  ]),

  resource: z.string().min(1).max(500),

  reason: z.string().max(500).optional(),
});
