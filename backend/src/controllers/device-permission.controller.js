import {
  getDevicePermissions,
  updateDevicePermission,
} from "../services/device-permission.service.js";

// Get device permissions
export const getPermissions = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const permissions = await getDevicePermissions(req.user.id, deviceId);

    return res.status(200).json({
      success: true,
      message: "Device permissions retrieved successfully",
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};

// Update device permission
export const updatePermission = async (req, res, next) => {
  try {
    const { deviceId, permissionId } = req.params;
    const { allowed } = req.body;

    const permission = await updateDevicePermission(
      req.user.id,
      deviceId,
      permissionId,
      allowed,
    );

    return res.status(200).json({
      success: true,
      message: "Device permission updated successfully",
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};
