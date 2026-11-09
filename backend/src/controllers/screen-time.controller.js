import {
  getScreenTimePolicy,
  createScreenTimePolicy,
  updateScreenTimePolicy,
  getPerAppLimits,
  createPerAppLimit,
  updatePerAppLimit,
  deletePerAppLimit,
} from "../services/screen-time.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Get Screen Time Policy ==========
export const getPolicy = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const parentId = req.user.id;

    const policy = await getScreenTimePolicy(parentId, deviceId);

    return res.status(200).json({
      success: true,
      message: "Screen time policy retrieved successfully",
      data: policy,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve screen time policy",
    });
  }
};

// ========== Create Screen Time Policy ==========
export const createPolicy = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const parentId = req.user.id;

    const policy = await createScreenTimePolicy(parentId, deviceId, req.body);

    await createAuditLog({
      actorId: parentId,
      deviceId,
      action: "SCREEN_TIME_POLICY_CREATED",
      entityType: "ScreenTimePolicy",
      entityId: policy.id,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Screen time policy created successfully",
      data: policy,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create screen time policy",
    });
  }
};

// ========== Update Screen Time Policy ==========
export const updatePolicy = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const parentId = req.user.id;

    const policy = await updateScreenTimePolicy(parentId, deviceId, req.body);

    await createAuditLog({
      actorId: parentId,
      deviceId,
      action: "SCREEN_TIME_POLICY_UPDATED",
      entityType: "ScreenTimePolicy",
      entityId: policy.id,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Screen time policy updated successfully",
      data: policy,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update screen time policy",
    });
  }
};

// ========== Get Per-App Limits ==========
export const getAppLimits = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const parentId = req.user.id;

    const limits = await getPerAppLimits(parentId, deviceId);

    return res.status(200).json({
      success: true,
      message: "Per-app limits retrieved successfully",
      data: limits,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve per-app limits",
    });
  }
};

// ========== Create Per-App Limit ==========
export const createAppLimit = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { appIdentifier, limitMinutes } = req.body;
    const parentId = req.user.id;

    const appLimit = await createPerAppLimit(
      parentId,
      deviceId,
      appIdentifier,
      limitMinutes,
    );

    await createAuditLog({
      actorId: parentId,
      deviceId,
      action: "PER_APP_LIMIT_CREATED",
      entityType: "PerAppLimit",
      entityId: appLimit.id,
      metadata: { appIdentifier, limitMinutes },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Per-app limit created successfully",
      data: appLimit,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create per-app limit",
    });
  }
};

// ========== Update Per-App Limit ==========
export const updateAppLimit = async (req, res) => {
  try {
    const { deviceId, limitId } = req.params;
    const { limitMinutes } = req.body;
    const parentId = req.user.id;

    const appLimit = await updatePerAppLimit(
      parentId,
      deviceId,
      limitId,
      limitMinutes,
    );

    await createAuditLog({
      actorId: parentId,
      deviceId,
      action: "PER_APP_LIMIT_UPDATED",
      entityType: "PerAppLimit",
      entityId: limitId,
      metadata: { limitMinutes },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Per-app limit updated successfully",
      data: appLimit,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update per-app limit",
    });
  }
};

// ========== Delete Per-App Limit ==========
export const deleteAppLimit = async (req, res) => {
  try {
    const { deviceId, limitId } = req.params;
    const parentId = req.user.id;

    await deletePerAppLimit(parentId, deviceId, limitId);

    await createAuditLog({
      actorId: parentId,
      deviceId,
      action: "PER_APP_LIMIT_DELETED",
      entityType: "PerAppLimit",
      entityId: limitId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Per-app limit deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete per-app limit",
    });
  }
};
