import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  saveSecurityAlert,
  getSecurityAlerts,
  getSecurityAlert,
  acknowledgeAlert,
} from "../controllers/security-alert.controller.js";

import { createSecurityAlertSchema } from "../validators/security-alert.validator.js";

const router = express.Router();

// ========== Create Suciry Alert ==========
router.post(
  "/device/alerts",
  authenticateDevice,
  validate(createSecurityAlertSchema),
  saveSecurityAlert,
);

// ========== Get All Security Alerts ==========
router.get("/alerts", authenticate, authorize("PARENT"), getSecurityAlerts);

// ========== Get Single Security Alert ==========
router.get(
  "/alerts/:alertId",
  authenticate,
  authorize("PARENT"),
  getSecurityAlert,
);

// ========== Acknowledge Security Alert ==========
router.patch(
  "/alerts/:alertId/acknowledge",
  authenticate,
  authorize("PARENT"),
  acknowledgeAlert,
);

export default router;
