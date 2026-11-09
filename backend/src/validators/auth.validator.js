import { z } from "zod";

// ========== Parent Registration Validation ==========
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z.string().trim().email("Invalid email address").max(255),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

// ========== User Login Validation ==========
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(1, "Password is required").max(72),
});

// ========== Refresh Token Validation ==========
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ========== MFA Login Verification ==========
export const verifyLoginMfaSchema = z.object({
  challengeToken: z.string().min(1, "MFA challenge token is required"),

  token: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});
