import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
  getNotifications,
  getNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// ========== GET ALL NOTIFICATIONS ==========
router.get("/notifications", authenticate, getNotifications);

// ========== GET SINGLE NOTIFICATION ==========
router.get("/notifications/:notificationId", authenticate, getNotification);

// ========== MARK NOTIFICATION AS READ ==========
router.patch(
  "/notifications/:notificationId/read",
  authenticate,
  markNotificationRead,
);

// ========== MARK ALL NOTIFICATIONS AS READ ==========
router.patch("/notifications/read-all", authenticate, markAllNotificationsRead);

export default router;
