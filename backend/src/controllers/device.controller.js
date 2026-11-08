import {
  getParentDevices,
  getParentDeviceById,
  updateParentDeviceStatus,
  removeParentDevice,
} from "../services/device.service.js";

// Get all devices of parent's children
export const getDevices = async (req, res, next) => {
  try {
    const devices = await getParentDevices(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Devices retrieved successfully",
      data: devices,
    });
  } catch (error) {
    next(error);
  }
};

// Get device details
export const getDeviceDetails = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const device = await getParentDeviceById(req.user.id, deviceId);

    return res.status(200).json({
      success: true,
      message: "Device details retrieved successfully",
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

// Update device status
export const updateDeviceStatus = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { status } = req.body;

    const device = await updateParentDeviceStatus(
      req.user.id,
      deviceId,
      status,
    );

    return res.status(200).json({
      success: true,
      message: "Device status updated successfully",
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

// Remove device
export const removeDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const device = await removeParentDevice(req.user.id, deviceId);

    return res.status(200).json({
      success: true,
      message: "Device removed successfully",
      data: device,
    });
  } catch (error) {
    next(error);
  }
};
