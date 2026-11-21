import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  checkUrlHandler,
  getDeviceDnsPolicyHandler,
  getBrowserSummaryHandler,
} from "../controllers/browser-filter.controller.js";

import { checkUrlSchema } from "../validators/browser-filter.validator.js";

const router = express.Router();

// ========== Real-time URL Filtering Check (Child Device) ==========
router.post(
  "/device/browser/check-url",
  authenticateDevice,
  validate(checkUrlSchema),
  checkUrlHandler,
);

// ========== Fetch Active DNS Policy & Rules (Child Device) ==========
router.get(
  "/device/browser/dns-policy",
  authenticateDevice,
  getDeviceDnsPolicyHandler,
);

// ========== Safe Browser Dashboard Summary (Parent) ==========
router.get(
  "/devices/:deviceId/browser/summary",
  authenticate,
  authorize("PARENT"),
  getBrowserSummaryHandler,
);

export default router;
