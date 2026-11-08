import { z } from "zod";

export const deviceRefreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
