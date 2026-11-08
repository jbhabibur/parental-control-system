import express from "express";

import { deviceHeartbeat } from "../controllers/device-heartbeat.controller.js";

import { authenticateDevice } from "../middlewares/device-auth.middleware.js";

const router = express.Router();

// Device heartbeat
router.post("/", authenticateDevice, deviceHeartbeat);

export default router;
