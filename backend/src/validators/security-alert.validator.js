import { z } from "zod";

// ========== Create Security Alert Schema ==========
export const createSecurityAlertSchema = z.object({
  type: z.enum([
    "PROHIBITED_APP_LAUNCH",
    "APP_INSTALL_ATTEMPT",
    "PROHIBITED_DOMAIN",
    "MALWARE_DETECTED",
    "PHISHING_DETECTED",
    "ROOT_DETECTED",
    "TAMPER_DETECTED",
    "DEVICE_OFFLINE",
    "SCREEN_TIME_EXCEEDED",
    "BEDTIME_VIOLATION",
    "PERMISSION_REQUEST",
    "OTHER",
  ]),

  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),

  title: z.string().trim().min(1).max(200),

  description: z.string().nullable().optional(),

  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});
