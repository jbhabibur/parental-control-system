import {
  generateDevicePairingCode,
  completeDevicePairing,
} from "../services/device-pairing.service.js";

// Generate device pairing code
export const createPairingCode = async (req, res, next) => {
  try {
    const { childId } = req.body;

    const result = await generateDevicePairingCode(req.user.id, childId);

    return res.status(201).json({
      success: true,
      message: "Device pairing code generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Complete device pairing
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
