import express from "express";

import healthRouter from "./health.route.js";
import authRouter from "./auth.route.js";
import devicePairingRouter from "./device-pairing.route.js";
import deviceHeartbeatRouter from "./device-heartbeat.route.js";
import deviceRefreshRouter from "./device-refresh.route.js";
import deviceLogoutRouter from "./device-logout.route.js";
import deviceRouter from "./device.route.js";
import devicePermissionRouter from "./device-permission.route.js";
import permissionRequestRouter from "./permission-request.route.js";
import screenTimeRouter from "./screen-time.route.js";
import appUsageRouter from "./app-usage.route.js";
import deviceActivityRouter from "./device-activity.route.js";
import remoteCommandRouter from "./remote-command.route.js";
import dnsPolicyRouter from "./dns-policy.route.js";
import domainCategoryRouter from "./domain-category.route.js";
import browserHistoryRouter from "./browser-history.route.js";

const router = express.Router();

// Health API
router.use("/health", healthRouter);

// Device Pairing APIs
router.use("/device-pairing", devicePairingRouter);

// Device Heartbeat APIs
router.use("/device-heartbeat", deviceHeartbeatRouter);

// Authentication APIs
router.use("/auth", authRouter);

// Device Refresh Token API
router.use("/device-refresh", deviceRefreshRouter);

// Device Logout API
router.use("/device-logout", deviceLogoutRouter);

// Device Management APIs
router.use("/devices", deviceRouter);

// Device Permission APIs
router.use("/devices", devicePermissionRouter);

// Screen Time Management APIs
router.use("/devices", screenTimeRouter);

// Child Permission Request API
router.use("/device", permissionRequestRouter);

// App Usage APIs
router.use("/", appUsageRouter);

// Device Activity APIs
router.use("/", deviceActivityRouter);

// Remote Device Command APIs
router.use("/", remoteCommandRouter);

// DNS Policy & Domain Rules APIs
router.use("/", dnsPolicyRouter);

// Domain Category Management APIs
router.use("/", domainCategoryRouter);

// Browser History Management APIs
router.use("/", browserHistoryRouter);

export default router;
