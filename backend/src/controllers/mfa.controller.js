import {
  setupMfa,
  enableMfa,
  getMfaStatus,
  disableMfa,
} from "../services/mfa.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Setup MFA ==========
export const setupMfaHandler = async (req, res, next) => {
  try {
    const result = await setupMfa(req.user.id);

    await createAuditLog({
      actorId: req.user.id,
      action: "MFA_SETUP_INITIATED",
      entityType: "MfaConfiguration",
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "MFA setup generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Enable MFA ==========
export const enableMfaHandler = async (req, res, next) => {
  try {
    const result = await enableMfa(req.user.id, req.body.token);

    await createAuditLog({
      actorId: req.user.id,
      action: "MFA_ENABLED",
      entityType: "MfaConfiguration",
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "MFA enabled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Get MFA Status ==========
export const getMfaStatusHandler = async (req, res, next) => {
  try {
    const result = await getMfaStatus(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Disable MFA ==========
export const disableMfaHandler = async (req, res, next) => {
  try {
    const result = await disableMfa(
      req.user.id,
      req.body.password,
      req.body.token,
    );

    await createAuditLog({
      actorId: req.user.id,
      action: "MFA_DISABLED",
      entityType: "MfaConfiguration",
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "MFA disabled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
