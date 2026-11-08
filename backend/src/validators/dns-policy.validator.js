import { z } from "zod";

// ========== CREATE DNS POLICY VALIDATOR ==========
export const createDnsPolicySchema = z.object({
  enabled: z.boolean().optional(),

  provider: z.string().trim().max(100).nullable().optional(),

  dohEndpoint: z.string().url().nullable().optional(),

  dotEndpoint: z.string().nullable().optional(),

  safeSearch: z.boolean().optional(),
});

// ========== UPDATE DNS POLICY VALIDATOR ==========
export const updateDnsPolicySchema = z
  .object({
    enabled: z.boolean().optional(),

    provider: z.string().trim().max(100).nullable().optional(),

    dohEndpoint: z.string().url().nullable().optional(),

    dotEndpoint: z.string().nullable().optional(),

    safeSearch: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

// ========== CREATE DOMAIN RULE VALIDATOR ==========
export const createDomainRuleSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),

  domain: z.string().trim().min(1).max(255).toLowerCase(),

  action: z.enum(["ALLOW", "BLOCK"]),
});

// ========= UPDATE DOMAIN RULE VALIDATOR ==========
export const updateDomainRuleSchema = z
  .object({
    categoryId: z.string().uuid().nullable().optional(),

    domain: z.string().trim().min(1).max(255).toLowerCase().optional(),

    action: z.enum(["ALLOW", "BLOCK"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
