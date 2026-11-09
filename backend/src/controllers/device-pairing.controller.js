import {
  generateDevicePairingCode,
  completeDevicePairing,
} from "../services/device-pairing.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Generate Device Pairing Code ==========
export const createPairingCode = async (req, res, next) => {
  try {
    const { childId } = req.body;

    const result = await generateDevicePairingCode(req.user.id, childId);

    await createAuditLog({
      actorId: req.user.id,
      action: "DEVICE_PAIRING_CODE_GENERATED",
      entityType: "DevicePairing",
      metadata: {
        childId,
      },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Device pairing code generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Complete Device Pairing ==========
export const completePairing = async (req, res, next) => {
  try {
    const result = await completeDevicePairing(req.body, req);

    return res.status(200).json({
      success: true,
      message: "Device paired successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
