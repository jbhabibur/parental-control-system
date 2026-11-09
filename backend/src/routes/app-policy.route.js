import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createAppPolicyHandler,
  getAppPolicies,
  updateAppPolicyHandler,
  deleteAppPolicyHandler,
} from "../controllers/app-policy.controller.js";

import {
  createAppPolicySchema,
  updateAppPolicySchema,
} from "../validators/app-policy.validator.js";

const router = express.Router();

// ========== CREATE APP POLICY ==========
router.post(
  "/devices/:deviceId/app-policies",
  authenticate,
  authorize("PARENT"),
  validate(createAppPolicySchema),
  createAppPolicyHandler,
);

// ========== GET ALL APP POLICIES ==========
router.get(
  "/devices/:deviceId/app-policies",
  authenticate,
  authorize("PARENT"),
  getAppPolicies,
);

// ========== UPDATE APP POLICY ==========
router.patch(
  "/devices/:deviceId/app-policies/:policyId",
  authenticate,
  authorize("PARENT"),
  validate(updateAppPolicySchema),
  updateAppPolicyHandler,
);

// ========== DELETE APP POLICY ==========
router.delete(
  "/devices/:deviceId/app-policies/:policyId",
  authenticate,
  authorize("PARENT"),
  deleteAppPolicyHandler,
);

export default router;
