import { z } from "zod";

export const updateDevicePermissionSchema = z.object({
  allowed: z.boolean({
    error: "Allowed must be true or false",
  }),
});
