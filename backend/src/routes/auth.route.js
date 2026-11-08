import express from "express";

import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validators/auth.validator.js";

import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Parent registration
router.post("/register", validate(registerSchema), register);

// User login
router.post("/login", validate(loginSchema), login);

// Refresh token
router.post("/refresh", validate(refreshTokenSchema), refresh);

// User logout
router.post("/logout", validate(refreshTokenSchema), logout);

// Protected profile
router.get("/me", authenticate, getCurrentUser);

// Parent-only profile
router.get("/parent/me", authenticate, authorize("PARENT"), getCurrentUser);

export default router;
