import { prisma } from "../config/database.js";

// ========== Record App Usage ==========
export const recordAppUsage = async (deviceId, data) => {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    select: {
      id: true,
      childId: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.appUsage.create({
    data: {
      deviceId: device.id,
      childId: device.childId,
      appIdentifier: data.appIdentifier,
      startedAt: data.startedAt,
      endedAt: data.endedAt ?? null,
      durationSeconds: data.durationSeconds ?? 0,
    },
  });
};

// ========= Get Device App Usage ==========
export const getDeviceAppUsage = async (parentId, deviceId) => {
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

  return prisma.appUsage.findMany({
    where: {
      deviceId,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};

// ========= Get App Usage Summary ==========
export const getAppUsageSummary = async (parentId, deviceId) => {
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

  return prisma.appUsage.groupBy({
    by: ["appIdentifier"],
    where: {
      deviceId,
    },
    _sum: {
      durationSeconds: true,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _sum: {
        durationSeconds: "desc",
      },
    },
  });
};
