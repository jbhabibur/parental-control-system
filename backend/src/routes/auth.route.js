import express from "express";

import {
  register,
  login,
  verifyMfaLogin,
  refresh,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyLoginMfaSchema,
} from "../validators/auth.validator.js";

import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// ========== Parent Registration ==========
router.post("/register", validate(registerSchema), register);

// ========== User Login ==========
router.post("/login", validate(loginSchema), login);

// ========== MFA Login Verification ==========
router.post(
  "/mfa/verify-login",
  validate(verifyLoginMfaSchema),
  verifyMfaLogin,
);

// ========== Refresh Token ==========
router.post("/refresh", validate(refreshTokenSchema), refresh);

// ========== User Logout ==========
router.post("/logout", validate(refreshTokenSchema), logout);

// ========== Protected Profile ==========
router.get("/me", authenticate, getCurrentUser);

// ========== Parent-Only Profile ==========
router.get("/parent/me", authenticate, authorize("PARENT"), getCurrentUser);

export default router;
