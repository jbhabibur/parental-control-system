import express from "express";

import { refreshDevice } from "../controllers/device-refresh.controller.js";

import { deviceRefreshSchema } from "../validators/device-refresh.validator.js";

import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Refresh device access token
router.post("/", validate(deviceRefreshSchema), refreshDevice);

export default router;
