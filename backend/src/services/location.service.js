import { prisma } from "../config/database.js";

// ========== GET LATEST DEVICE LOCATION ==========
export const getLatestDeviceLocation = async (parentId, deviceId) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.deviceActivity.findFirst({
    where: {
      deviceId,
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: {
      capturedAt: "desc",
    },
    select: {
      id: true,
      deviceId: true,
      latitude: true,
      longitude: true,
      capturedAt: true,
    },
  });
};

// ========== GET DEVICE LOCATION HISTORY ==========
export const getDeviceLocationHistory = async (parentId, deviceId) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.deviceActivity.findMany({
    where: {
      deviceId,
      latitude: { not: null },
      longitude: { not: null },
    },
    orderBy: {
      capturedAt: "desc",
    },
    select: {
      id: true,
      deviceId: true,
      latitude: true,
      longitude: true,
      capturedAt: true,
    },
  });
};
