import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  getPolicy,
  createPolicy,
  updatePolicy,
  getAppLimits,
  createAppLimit,
  updateAppLimit,
  deleteAppLimit,
} from "../controllers/screen-time.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createScreenTimePolicySchema,
  updateScreenTimePolicySchema,
  createPerAppLimitSchema,
  updatePerAppLimitSchema,
} from "../validators/screen-time.validator.js";

const router = express.Router();

// Get Screen Time Policy
router.get(
  "/:deviceId/screen-time-policy",
  authenticate,
  authorize("PARENT"),
  getPolicy,
);

// Create Screen Time Policy
router.post(
  "/:deviceId/screen-time-policy",
  authenticate,
  authorize("PARENT"),
  validate(createScreenTimePolicySchema),
  createPolicy,
);

// Update Screen Time Policy
router.patch(
  "/:deviceId/screen-time-policy",
  authenticate,
  authorize("PARENT"),
  validate(updateScreenTimePolicySchema),
  updatePolicy,
);

// Get Per-App Limits
router.get(
  "/:deviceId/app-limits",
  authenticate,
  authorize("PARENT"),
  getAppLimits,
);

// Create Per-App Limit
router.post(
  "/:deviceId/app-limits",
  authenticate,
  authorize("PARENT"),
  validate(createPerAppLimitSchema),
  createAppLimit,
);

// Update Per-App Limit
router.patch(
  "/:deviceId/app-limits/:limitId",
  authenticate,
  authorize("PARENT"),
  validate(updatePerAppLimitSchema),
  updateAppLimit,
);

// Delete Per-App Limit
router.delete(
  "/:deviceId/app-limits/:limitId",
  authenticate,
  authorize("PARENT"),
  deleteAppLimit,
);

export default router;
