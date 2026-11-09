import {
  registerUser,
  loginUser,
  verifyLoginMfa,
  refreshUserToken,
  logoutUser,
} from "../services/auth.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Parent Registration ==========
export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body, req);

    await createAuditLog({
      actorId: result.user.id,
      action: "PARENT_REGISTERED",
      entityType: "User",
      entityId: result.user.id,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== User Login ==========
export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body, req);

    if (result.mfaRequired) {
      await createAuditLog({
        actorId: result.user.id,
        action: "LOGIN_MFA_CHALLENGE_ISSUED",
        entityType: "User",
        entityId: result.user.id,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: "MFA verification required",
        ...result,
      });
    }

    await createAuditLog({
      actorId: result.user.id,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: result.user.id,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Verify MFA Login ==========
export const verifyMfaLogin = async (req, res, next) => {
  try {
    const { challengeToken, token } = req.body;

    const result = await verifyLoginMfa(challengeToken, token, req);

    await createAuditLog({
      actorId: result.user.id,
      action: "USER_LOGIN_MFA_VERIFIED",
      entityType: "User",
      entityId: result.user.id,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "MFA verification successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Refresh Access Token ==========
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshUserToken(refreshToken, req);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== User Logout ==========
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await logoutUser(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// ========== Get Authenticated User Profile ==========
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
