import { prisma } from "../config/database.js";

// ========== Record Device Activity ==========
export const recordDeviceActivity = async (deviceId, data) => {
  const device = await prisma.device.findUnique({
    where: {
      id: deviceId,
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

  return prisma.deviceActivity.create({
    data: {
      deviceId: device.id,
      activityType: data.activityType,
      foregroundApp: data.foregroundApp ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      metadata: data.metadata ?? undefined,
      capturedAt: data.capturedAt,
    },
  });
};

// ========== Get Device Activity History ==========
export const getDeviceActivityHistory = async (parentId, deviceId) => {
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
    },
    orderBy: {
      capturedAt: "desc",
    },
  });
};

// ========== Get Device Activity Summary ==========
export const getDeviceActivitySummary = async (parentId, deviceId) => {
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

  return prisma.deviceActivity.groupBy({
    by: ["activityType"],
    where: {
      deviceId,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });
};
