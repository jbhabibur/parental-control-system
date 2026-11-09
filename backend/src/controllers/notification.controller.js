import {
  getAllNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

// ========== GET ALL NOTIFICATIONS ==========
export const getNotifications = async (req, res) => {
  try {
    const data = await getAllNotifications(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET SINGLE NOTIFICATION ==========
export const getNotification = async (req, res) => {
  try {
    const data = await getNotificationById(
      req.user.id,
      req.params.notificationId,
    );

    return res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== MARK NOTIFICATION AS READ ==========
export const markNotificationRead = async (req, res) => {
  try {
    const data = await markNotificationAsRead(
      req.user.id,
      req.params.notificationId,
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== MARK ALL NOTIFICATIONS AS READ ==========
export const markAllNotificationsRead = async (req, res) => {
  try {
    const data = await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
