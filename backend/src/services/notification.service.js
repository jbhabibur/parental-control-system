import { prisma } from "../config/database.js";

// ========== GET ALL NOTIFICATIONS ==========
export const getAllNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ========== GET SINGLE NOTIFICATION ==========
export const getNotificationById = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  return notification;
};

// ========== MARK NOTIFICATION AS READ ==========
export const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      readAt: new Date(),
    },
  });
};

// ========== MARK ALL NOTIFICATIONS AS READ ==========
export const markAllNotificationsAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
};
