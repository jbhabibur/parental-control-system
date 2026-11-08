import express from "express";

import {
  createPairingCode,
  completePairing,
} from "../controllers/device-pairing.controller.js";

import {
  pairingSchema,
  completePairingSchema,
} from "../validators/device-pairing.validator.js";

import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Generate device pairing code (Parent only)
router.post(
  "/generate",
  authenticate,
  authorize("PARENT"),
  validate(pairingSchema),
  createPairingCode,
);

// Complete device pairing (Child device)
router.post("/complete", validate(completePairingSchema), completePairing);

export default router;
