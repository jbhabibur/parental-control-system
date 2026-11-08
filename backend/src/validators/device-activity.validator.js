import { z } from "zod";

export const createDeviceActivitySchema = z
  .object({
    activityType: z.enum([
      "APP_LAUNCH",
      "APP_CLOSE",
      "DEVICE_ONLINE",
      "DEVICE_OFFLINE",
      "SCREEN_LOCK",
      "SCREEN_UNLOCK",
      "POLICY_VIOLATION",
      "LOCATION_UPDATE",
      "OTHER",
    ]),

    foregroundApp: z.string().max(255).nullable().optional(),

    latitude: z.number().min(-90).max(90).nullable().optional(),

    longitude: z.number().min(-180).max(180).nullable().optional(),

    metadata: z.record(z.string(), z.unknown()).nullable().optional(),

    capturedAt: z.coerce.date(),
  })
  .refine(
    (data) =>
      (data.latitude == null && data.longitude == null) ||
      (data.latitude != null && data.longitude != null),
    {
      message: "Latitude and longitude must be provided together",
      path: ["latitude"],
    },
  );
