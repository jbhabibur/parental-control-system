import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createAppUsage,
  getDeviceUsage,
  getUsageSummary,
} from "../controllers/app-usage.controller.js";

import { createAppUsageSchema } from "../validators/app-usage.validator.js";

const router = express.Router();

// ========== Record App Usage (Child Device) ==========
router.post(
  "/device/app-usage",
  authenticateDevice,
  validate(createAppUsageSchema),
  createAppUsage,
);

// ========== Get Device App Usage (Parent) ==========
router.get(
  "/devices/:deviceId/app-usage",
  authenticate,
  authorize("PARENT"),
  getDeviceUsage,
);

// ========== Get App Usage Summary (Parent) ==========
router.get(
  "/devices/:deviceId/app-usage/summary",
  authenticate,
  authorize("PARENT"),
  getUsageSummary,
);

export default router;
