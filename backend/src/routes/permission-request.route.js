import express from "express";

import {
  createRequest,
  getPermissionRequests,
  approveRequest,
  denyRequest,
  getMyPermissionRequests,
} from "../controllers/permission-request.controller.js";

import { authenticateDevice } from "../middlewares/device-auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { createPermissionRequestSchema } from "../validators/permission-request.validator.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/permission-requests",
  authenticateDevice,
  validate(createPermissionRequestSchema),
  createRequest,
);

router.get(
  "/my-permission-requests",
  authenticateDevice,
  getMyPermissionRequests,
);

router.get(
  "/permission-requests",
  authenticate,
  authorize("PARENT"),
  getPermissionRequests,
);

router.patch(
  "/permission-requests/:requestId/approve",
  authenticate,
  authorize("PARENT"),
  approveRequest,
);

router.patch(
  "/permission-requests/:requestId/reject",
  authenticate,
  authorize("PARENT"),
  denyRequest,
);

export default router;
