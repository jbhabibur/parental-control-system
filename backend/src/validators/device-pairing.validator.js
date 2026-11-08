import { z } from "zod";

// Validate device pairing request
export const pairingSchema = z.object({
  childId: z.string().uuid("Invalid child ID"),
});

// Complete device pairing validation
export const completePairingSchema = z.object({
  pairingCode: z.string().regex(/^\d{6}$/, "Pairing code must be 6 digits"),

  deviceIdentifier: z.string().min(1).max(255),

  deviceName: z.string().min(1).max(150),

  platform: z.enum(["ANDROID", "IOS"]),

  osVersion: z.string().max(100).optional(),

  appVersion: z.string().max(50).optional(),
});
