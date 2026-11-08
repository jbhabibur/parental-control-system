import express from "express";

import { deviceLogout } from "../controllers/device-logout.controller.js";

import { deviceLogoutSchema } from "../validators/device-logout.validator.js";

import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Device logout
router.post("/", validate(deviceLogoutSchema), deviceLogout);

export default router;
