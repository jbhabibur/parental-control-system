import { z } from "zod";

// ========== CREATE APP POLICY VALIDATION ==========
export const createAppPolicySchema = z.object({
  body: z.object({
    appIdentifier: z.string().trim().min(1).max(255),
    appName: z.string().trim().max(150).nullable().optional(),
    decision: z.enum(["ALLOW", "BLOCK"]),
    category: z.string().trim().max(100).nullable().optional(),
  }),
});

// ========== UPDATE APP POLICY VALIDATION ==========
export const updateAppPolicySchema = z.object({
  body: z
    .object({
      appIdentifier: z.string().trim().min(1).max(255).optional(),
      appName: z.string().trim().max(150).nullable().optional(),
      decision: z.enum(["ALLOW", "BLOCK"]).optional(),
      category: z.string().trim().max(100).nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});
