import express from "express";

import {
  getDevices,
  getDeviceDetails,
  updateDeviceStatus,
  removeDevice,
} from "../controllers/device.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { updateDeviceStatusSchema } from "../validators/device.validator.js";

const router = express.Router();

// Get all devices of parent's children
router.get("/", authenticate, authorize("PARENT"), getDevices);

// Get device details
router.get("/:deviceId", authenticate, authorize("PARENT"), getDeviceDetails);

// Update device status
router.patch(
  "/:deviceId/status",
  authenticate,
  authorize("PARENT"),
  validate(updateDeviceStatusSchema),
  updateDeviceStatus,
);

// Remove device
router.delete("/:deviceId", authenticate, authorize("PARENT"), removeDevice);

export default router;
