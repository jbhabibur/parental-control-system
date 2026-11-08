import express from "express";

import {
  getPermissions,
  updatePermission,
} from "../controllers/device-permission.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/role.middleware.js";

import { updateDevicePermissionSchema } from "../validators/device-permission.validator.js";

import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Get device permissions (Parent only)
router.get(
  "/:deviceId/permissions",
  authenticate,
  authorize("PARENT"),
  getPermissions,
);

// Update device permission
router.patch(
  "/:deviceId/permissions/:permissionId",
  authenticate,
  authorize("PARENT"),
  validate(updateDevicePermissionSchema),
  updatePermission,
);

export default router;
