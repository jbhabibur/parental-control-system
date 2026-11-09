import { z } from "zod";

// ========== MFA OTP Validation ==========
const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

// ========== Enable MFA Validation ==========
export const enableMfaSchema = z.object({
  body: z.object({
    token: otpSchema,
  }),
});

// ========== Disable MFA Validation ==========
export const disableMfaSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(1, "Password is required")
      .max(72, "Password cannot exceed 72 characters"),

    token: otpSchema,
  }),
});
