import {
  getLatestDeviceLocation,
  getDeviceLocationHistory,
} from "../services/location.service.js";

// ========== GET LATEST DEVICE LOCATION ==========
export const getLatestLocation = async (req, res) => {
  try {
    const data = await getLatestDeviceLocation(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Latest device location retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET DEVICE LOCATION HISTORY ==========
export const getLocationHistory = async (req, res) => {
  try {
    const data = await getDeviceLocationHistory(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Device location history retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
