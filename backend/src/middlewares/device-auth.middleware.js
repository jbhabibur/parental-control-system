import jwt from "jsonwebtoken";

import env from "../config/dotenv.js";
import { prisma } from "../config/database.js";

// Authenticate child device using access token
export const authenticateDevice = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Device authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Validate device access token
    if (
      decoded.role !== "CHILD" ||
      !decoded.sub ||
      !decoded.deviceId ||
      decoded.tokenType === "refresh"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid device authentication token",
      });
    }

    // Find device and its child user
    const device = await prisma.device.findUnique({
      where: {
        id: decoded.deviceId,
      },
      include: {
        child: {
          select: {
            id: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!device || device.childId !== decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid device",
      });
    }

    if (device.child.role !== "CHILD" || device.child.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Child account is not active",
      });
    }

    if (
      device.status === "LOCKED" ||
      device.status === "PAUSED" ||
      device.status === "REMOVED"
    ) {
      return res.status(403).json({
        success: false,
        message: "Device is not allowed to access the system",
      });
    }

    // Attach authenticated device information
    req.device = device;
    req.user = device.child;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Device access token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid device authentication token",
    });
  }
};
