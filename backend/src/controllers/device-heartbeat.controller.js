import { updateDeviceHeartbeat } from "../services/device-heartbeat.service.js";

// Device heartbeat
export const deviceHeartbeat = async (req, res, next) => {
  try {
    const deviceId = req.device.id;
    const ipAddress = req.ip;

    const result = await updateDeviceHeartbeat(deviceId, ipAddress);

    return res.status(200).json({
      success: true,
      message: "Device heartbeat received successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
