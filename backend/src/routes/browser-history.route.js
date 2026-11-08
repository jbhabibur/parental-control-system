import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  saveBrowserHistory,
  getBrowserHistory,
} from "../controllers/browser-history.controller.js";

import { createBrowserHistorySchema } from "../validators/browser-history.validator.js";

const router = express.Router();

// ========== Save Browser History ==========
router.post(
  "/device/browser-history",
  authenticateDevice,
  validate(createBrowserHistorySchema),
  saveBrowserHistory,
);

// ========== Get Device Browser History ==========
router.get(
  "/devices/:deviceId/browser-history",
  authenticate,
  authorize("PARENT"),
  getBrowserHistory,
);

export default router;
