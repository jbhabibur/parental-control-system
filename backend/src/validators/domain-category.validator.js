import { z } from "zod";

// ========== Create Domain Category Schema ==========
export const createDomainCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),

  slug: z.string().trim().min(1).max(100).toLowerCase(),

  description: z.string().nullable().optional(),
});

// ========== Update Domain Category Schema ==========
export const updateDomainCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),

    slug: z.string().trim().min(1).max(100).toLowerCase().optional(),

    description: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
