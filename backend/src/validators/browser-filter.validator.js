import { z } from "zod";

/**
 * Validator for real-time URL check requests sent by the Child Safe Browser.
 */
export const checkUrlSchema = z.object({
  url: z.string().trim().min(1, "URL is required").max(2048),
  domain: z.string().trim().max(255).optional(),
  pageTitle: z.string().trim().max(300).nullable().optional(),
  // When true (default), unknown domains automatically submit a DOMAIN_ACCESS request to parent
  autoRequest: z.boolean().optional().default(true),
});
