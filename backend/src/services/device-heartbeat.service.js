import { prisma } from "../config/database.js";

// Update device heartbeat
export const updateDeviceHeartbeat = async (deviceId, ipAddress) => {
  const device = await prisma.device.findUnique({
    where: {
      id: deviceId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    device.status === "LOCKED" ||
    device.status === "PAUSED" ||
    device.status === "REMOVED"
  ) {
    const error = new Error("Device is not allowed to access the system");
    error.statusCode = 403;
    throw error;
  }

  const updatedDevice = await prisma.device.update({
    where: {
      id: deviceId,
    },
    data: {
      status: "ACTIVE",
      lastSeenAt: new Date(),
      lastIpAddress: ipAddress || null,
    },
    select: {
      id: true,
      deviceName: true,
      platform: true,
      status: true,
      lastSeenAt: true,
      lastIpAddress: true,
    },
  });

  return updatedDevice;
};
