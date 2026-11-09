import { z } from "zod";

// ========== Get Audit Logs Validation ==========
export const getAuditLogsSchema = z.object({
  query: z
    .object({
      deviceId: z.string().uuid("Invalid device ID").optional(),

      action: z
        .string()
        .max(150, "Action cannot exceed 150 characters")
        .optional(),

      startDate: z
        .string()
        .datetime({ offset: true, message: "Invalid start date" })
        .optional(),

      endDate: z
        .string()
        .datetime({ offset: true, message: "Invalid end date" })
        .optional(),

      page: z.coerce.number().int().min(1).optional(),

      limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .refine(
      (data) =>
        !data.startDate ||
        !data.endDate ||
        new Date(data.startDate) <= new Date(data.endDate),
      {
        message: "Start date cannot be later than end date",
        path: ["endDate"],
      },
    ),
});
