import { z } from "zod";

// ========== Create Browser Historty Schema ==========
export const createBrowserHistorySchema = z.object({
  url: z.string().trim().min(1),

  domain: z.string().trim().min(1).max(255),

  pageTitle: z.string().nullable().optional(),

  blocked: z.boolean().optional(),

  category: z.string().max(100).nullable().optional(),

  visitedAt: z.coerce.date(),
});
