import express from "express";

import {
  setupMfaHandler,
  enableMfaHandler,
  getMfaStatusHandler,
  disableMfaHandler,
} from "../controllers/mfa.controller.js";

import {
  enableMfaSchema,
  disableMfaSchema,
} from "../validators/mfa.validator.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// ========== Parent Authentication ==========
router.use(authenticate, authorize("PARENT"));

// ========== Setup MFA ==========
router.post("/setup", setupMfaHandler);

// ========== Enable MFA ==========
router.post("/enable", validate(enableMfaSchema), enableMfaHandler);

// ========== Get MFA Status ==========
router.get("/status", getMfaStatusHandler);

// ========== Disable MFA ==========
router.post("/disable", validate(disableMfaSchema), disableMfaHandler);

export default router;
