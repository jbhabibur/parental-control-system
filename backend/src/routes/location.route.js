import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  getLatestLocation,
  getLocationHistory,
} from "../controllers/location.controller.js";

const router = express.Router();

// ========== GET LATEST DEVICE LOCATION ==========
router.get(
  "/devices/:deviceId/location",
  authenticate,
  authorize("PARENT"),
  getLatestLocation,
);

// ========== GET DEVICE LOCATION HISTORY ==========
router.get(
  "/devices/:deviceId/location/history",
  authenticate,
  authorize("PARENT"),
  getLocationHistory,
);

export default router;
