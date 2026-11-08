import { z } from "zod";

export const createScreenTimePolicySchema = z.object({
  enabled: z.boolean().optional(),

  dailyLimitMinutes: z.number().int().positive(),

  bedtimeStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),

  bedtimeEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),

  timezone: z.string().min(1).max(100).optional(),
});

export const updateScreenTimePolicySchema = z
  .object({
    enabled: z.boolean().optional(),

    dailyLimitMinutes: z.number().int().positive().optional(),

    bedtimeStart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable()
      .optional(),

    bedtimeEnd: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable()
      .optional(),

    timezone: z.string().min(1).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const createPerAppLimitSchema = z.object({
  appIdentifier: z.string().min(1).max(255),

  limitMinutes: z.number().int().positive(),
});

export const updatePerAppLimitSchema = z.object({
  limitMinutes: z.number().int().positive(),
});
