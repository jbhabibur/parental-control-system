import {
  createAppPolicy,
  getAllAppPolicies,
  updateAppPolicy,
  deleteAppPolicy,
} from "../services/app-policy.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== CREATE APP POLICY ==========
export const createAppPolicyHandler = async (req, res) => {
  try {
    const data = await createAppPolicy(
      req.user.id,
      req.params.deviceId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "APP_POLICY_CREATED",
      entityType: "AppPolicy",
      entityId: data.id,
      metadata: {
        appIdentifier: data.appIdentifier,
        decision: data.decision,
      },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "App policy created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET ALL APP POLICIES ==========
export const getAppPolicies = async (req, res) => {
  try {
    const data = await getAllAppPolicies(req.user.id, req.params.deviceId);

    return res.status(200).json({
      success: true,
      message: "App policies retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== UPDATE APP POLICY ==========
export const updateAppPolicyHandler = async (req, res) => {
  try {
    const data = await updateAppPolicy(
      req.user.id,
      req.params.deviceId,
      req.params.policyId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "APP_POLICY_UPDATED",
      entityType: "AppPolicy",
      entityId: req.params.policyId,
      metadata: {
        appIdentifier: data.appIdentifier,
        decision: data.decision,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "App policy updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== DELETE APP POLICY ==========
export const deleteAppPolicyHandler = async (req, res) => {
  try {
    await deleteAppPolicy(
      req.user.id,
      req.params.deviceId,
      req.params.policyId,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "APP_POLICY_DELETED",
      entityType: "AppPolicy",
      entityId: req.params.policyId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "App policy deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
