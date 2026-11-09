import {
  createPermissionRequest,
  getParentPermissionRequests,
  approvePermissionRequest,
  denyPermissionRequest,
  getChildPermissionRequests,
} from "../services/permission-request.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Create Permission Request (CHILD) ==========
export const createRequest = async (req, res, next) => {
  try {
    const { requestType, resource, reason } = req.body;

    const permissionRequest = await createPermissionRequest(
      req.user.id,
      req.device.id,
      requestType,
      resource,
      reason,
    );

    return res.status(201).json({
      success: true,
      message: "Permission request submitted successfully",
      data: permissionRequest,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Get Parent Permission Requests ==========
export const getPermissionRequests = async (req, res, next) => {
  try {
    const requests = await getParentPermissionRequests(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Permission requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Approve Permission Request (PARENT) ==========
export const approveRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const request = await approvePermissionRequest(req.user.id, requestId);

    await createAuditLog({
      actorId: req.user.id,
      deviceId: request.deviceId,
      action: "PERMISSION_REQUEST_APPROVED",
      entityType: "PermissionRequest",
      entityId: requestId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Permission request approved successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Deny Permission Request (PARENT) ==========
export const denyRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const request = await denyPermissionRequest(req.user.id, requestId);

    await createAuditLog({
      actorId: req.user.id,
      deviceId: request.deviceId,
      action: "PERMISSION_REQUEST_DENIED",
      entityType: "PermissionRequest",
      entityId: requestId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Permission request denied successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Get Child Permission Requests ==========
export const getMyPermissionRequests = async (req, res, next) => {
  try {
    const requests = await getChildPermissionRequests(
      req.user.id,
      req.device.id,
    );

    return res.status(200).json({
      success: true,
      message: "Permission requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
