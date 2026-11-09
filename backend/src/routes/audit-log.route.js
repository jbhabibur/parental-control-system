import express from "express";

import { getAuditLogsHandler } from "../controllers/audit-log.controller.js";

import { getAuditLogsSchema } from "../validators/audit-log.validator.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// ========== Parent Authentication ==========
router.use(authenticate, authorize("PARENT"));

// ========== Get Audit Logs ==========
router.get("/audit-logs", validate(getAuditLogsSchema), getAuditLogsHandler);

export default router;
