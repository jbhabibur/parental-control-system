import {
  createBrowserHistory,
  getDeviceBrowserHistory,
} from "../services/browser-history.service.js";

// ========== CREATE BROWSER HISTORY ==========
export const saveBrowserHistory = async (req, res) => {
  try {
    const data = await createBrowserHistory(
      req.device.id,
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Browser history saved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET DEVICE BROWSER HISTORY
export const getBrowserHistory = async (req, res) => {
  try {
    const data = await getDeviceBrowserHistory(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Browser history retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
