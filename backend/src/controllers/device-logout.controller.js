import { logoutDevice } from "../services/auth.service.js";

// Device logout
export const deviceLogout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await logoutDevice(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Device logout successful",
    });
  } catch (error) {
    next(error);
  }
};
