import {
  createSecurityAlert,
  getAllSecurityAlerts,
  getSecurityAlertById,
  acknowledgeSecurityAlert,
} from "../services/security-alert.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Create Security Alert ==========
export const saveSecurityAlert = async (req, res) => {
  try {
    const data = await createSecurityAlert(
      req.device.id,
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Security alert created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get All Security Alerts ==========
export const getSecurityAlerts = async (req, res) => {
  try {
    const data = await getAllSecurityAlerts(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Security alerts retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Single Security Alert ==========
export const getSecurityAlert = async (req, res) => {
  try {
    const data = await getSecurityAlertById(req.user.id, req.params.alertId);

    return res.status(200).json({
      success: true,
      message: "Security alert retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Acknowledge Security Alert ==========
export const acknowledgeAlert = async (req, res) => {
  try {
    const data = await acknowledgeSecurityAlert(
      req.user.id,
      req.params.alertId,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: data.deviceId,
      action: "SECURITY_ALERT_ACKNOWLEDGED",
      entityType: "SecurityAlert",
      entityId: req.params.alertId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Security alert acknowledged successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
