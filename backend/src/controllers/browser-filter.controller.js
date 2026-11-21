/**
 * ============================================================================
 * Safe Browser Filter Controller
 * ============================================================================
 * Express request handlers for Child Safe Browser URL verification,
 * policy synchronization, and Parent Safe Browser Dashboard summary.
 */

import {
  checkUrlForDevice,
  getDeviceBrowserPolicy,
  getParentBrowserSummary,
} from "../services/browser-filter.service.js";

// ========== CHECK URL IN REAL TIME (CHILD DEVICE) ==========
export const checkUrlHandler = async (req, res) => {
  try {
    const data = await checkUrlForDevice(req.device.id, req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: data.allowed
        ? "URL allowed"
        : data.message || "URL blocked or pending parent approval",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET DEVICE DNS POLICY & RULES (CHILD DEVICE) ==========
export const getDeviceDnsPolicyHandler = async (req, res) => {
  try {
    const data = await getDeviceBrowserPolicy(req.device.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Device browser DNS policy retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET SAFE BROWSER DASHBOARD SUMMARY (PARENT) ==========
export const getBrowserSummaryHandler = async (req, res) => {
  try {
    const data = await getParentBrowserSummary(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Browser dashboard summary retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
