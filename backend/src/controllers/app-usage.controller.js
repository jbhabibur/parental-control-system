import {
  recordAppUsage,
  getDeviceAppUsage,
  getAppUsageSummary,
} from "../services/app-usage.service.js";

// ========== Record App Usage ==========
export const createAppUsage = async (req, res) => {
  try {
    const data = await recordAppUsage(req.device.id, req.body);

    return res.status(201).json({
      success: true,
      message: "App usage recorded successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Device App Usage ==========
export const getDeviceUsage = async (req, res) => {
  try {
    const data = await getDeviceAppUsage(req.user.id, req.params.deviceId);

    return res.status(200).json({
      success: true,
      message: "App usage history retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========= Get App Usage Summary ==========
export const getUsageSummary = async (req, res) => {
  try {
    const data = await getAppUsageSummary(req.user.id, req.params.deviceId);

    return res.status(200).json({
      success: true,
      message: "App usage summary retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
