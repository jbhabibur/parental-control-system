import { z } from "zod";

export const updateDeviceStatusSchema = z.object({
  status: z.enum(["ACTIVE", "OFFLINE", "LOCKED", "PAUSED"]),
});
