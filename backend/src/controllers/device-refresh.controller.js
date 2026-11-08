import { refreshDeviceToken } from "../services/auth.service.js";

// Refresh device access token
export const refreshDevice = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshDeviceToken(refreshToken, req);

    return res.status(200).json({
      success: true,
      message: "Device token refreshed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
