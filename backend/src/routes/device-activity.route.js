import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createDeviceActivity,
  getDeviceActivities,
  getActivitySummary,
} from "../controllers/device-activity.controller.js";

import { createDeviceActivitySchema } from "../validators/device-activity.validator.js";

const router = express.Router();

// ========== Record Device Activity (Child Device) ==========
router.post(
  "/device/activity",
  authenticateDevice,
  validate(createDeviceActivitySchema),
  createDeviceActivity,
);

// ========== Get Device Activity History (Parent) ==========
router.get(
  "/devices/:deviceId/activities",
  authenticate,
  authorize("PARENT"),
  getDeviceActivities,
);

// ========== Get Device Activity Summary (Parent) ==========
router.get(
  "/devices/:deviceId/activities/summary",
  authenticate,
  authorize("PARENT"),
  getActivitySummary,
);

export default router;
