import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createPolicy,
  getPolicy,
  updatePolicy,
  createDomainRule,
  getRules,
  updateRule,
  deleteRule,
} from "../controllers/dns-policy.controller.js";

import {
  createDnsPolicySchema,
  updateDnsPolicySchema,
  createDomainRuleSchema,
  updateDomainRuleSchema,
} from "../validators/dns-policy.validator.js";

const router = express.Router();

// ============ CREATE DNS POLICY (PARENT) ==========
router.post(
  "/devices/:deviceId/dns-policy",
  authenticate,
  authorize("PARENT"),
  validate(createDnsPolicySchema),
  createPolicy,
);

// =========== Get DNS Policy (PARENT) ==========
router.get(
  "/devices/:deviceId/dns-policy",
  authenticate,
  authorize("PARENT"),
  getPolicy,
);

// ========== Update DNS Policy (PARENT) ==========
router.patch(
  "/devices/:deviceId/dns-policy",
  authenticate,
  authorize("PARENT"),
  validate(updateDnsPolicySchema),
  updatePolicy,
);

// ========== Add Domain Rule (PARENT) ==========
router.post(
  "/devices/:deviceId/dns-policy/domain-rules",
  authenticate,
  authorize("PARENT"),
  validate(createDomainRuleSchema),
  createDomainRule,
);

// ========== Get Domain Rules (PARENT) ==========
router.get(
  "/devices/:deviceId/dns-policy/domain-rules",
  authenticate,
  authorize("PARENT"),
  getRules,
);

// ========== Update Domain Rule (PARENT) ==========
router.patch(
  "/devices/:deviceId/dns-policy/domain-rules/:ruleId",
  authenticate,
  authorize("PARENT"),
  validate(updateDomainRuleSchema),
  updateRule,
);

// ========== DELETE DOMAIN RULE (PARENT) ==========
router.delete(
  "/devices/:deviceId/dns-policy/domain-rules/:ruleId",
  authenticate,
  authorize("PARENT"),
  deleteRule,
);

export default router;
