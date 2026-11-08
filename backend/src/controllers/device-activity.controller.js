import {
  recordDeviceActivity,
  getDeviceActivityHistory,
  getDeviceActivitySummary,
} from "../services/device-activity.service.js";

// ========== Record Device Activity ==========
export const createDeviceActivity = async (req, res) => {
  try {
    const data = await recordDeviceActivity(req.device.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Device activity recorded successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Device Activity History ==========
export const getDeviceActivities = async (req, res) => {
  try {
    const data = await getDeviceActivityHistory(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Device activity history retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Device Activity Summary ==========
export const getActivitySummary = async (req, res) => {
  try {
    const data = await getDeviceActivitySummary(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Device activity summary retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
