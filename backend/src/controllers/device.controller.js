import {
  getParentDevices,
  getParentDeviceById,
  updateParentDeviceStatus,
  removeParentDevice,
} from "../services/device.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Get All Parent Devices ==========
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

// ========== Get Device Details ==========
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

// ========== Update Device Status ==========
export const updateDeviceStatus = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { status } = req.body;

    const device = await updateParentDeviceStatus(
      req.user.id,
      deviceId,
      status,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId,
      action: "DEVICE_STATUS_UPDATED",
      entityType: "Device",
      entityId: deviceId,
      metadata: { status },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Device status updated successfully",
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Remove Device ==========
export const removeDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const device = await removeParentDevice(req.user.id, deviceId);

    await createAuditLog({
      actorId: req.user.id,
      deviceId,
      action: "DEVICE_REMOVED",
      entityType: "Device",
      entityId: deviceId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Device removed successfully",
      data: device,
    });
  } catch (error) {
    next(error);
  }
};
