import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createCommand,
  getPendingDeviceCommands,
  updateDeviceCommandStatus,
  getCommandHistory,
} from "../controllers/remote-command.controller.js";

import {
  createRemoteCommandSchema,
  updateCommandStatusSchema,
} from "../validators/remote-command.validator.js";

const router = express.Router();

// ========== Create Remote Command (PARENT) ==========
router.post(
  "/devices/:deviceId/commands",
  authenticate,
  authorize("PARENT"),
  validate(createRemoteCommandSchema),
  createCommand,
);

// =========== GET PENDING COMMANDS (CHILD DEVICE) ==========
router.get("/device/commands", authenticateDevice, getPendingDeviceCommands);

// ========== Update Command Status (CHILD DEVICE) ==========
router.patch(
  "/device/commands/:commandId/status",
  authenticateDevice,
  validate(updateCommandStatusSchema),
  updateDeviceCommandStatus,
);

// ========== Get Command History (PARENT) ==========
router.get(
  "/devices/:deviceId/commands",
  authenticate,
  authorize("PARENT"),
  getCommandHistory,
);

export default router;
