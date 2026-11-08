import { prisma } from "../config/database.js";

// ========== CREATE BROWSER HISTORY ==========
export const createBrowserHistory = async (deviceId, childId, data) => {
  return prisma.browserHistory.create({
    data: {
      deviceId,
      childId,
      url: data.url,
      domain: data.domain,
      pageTitle: data.pageTitle ?? null,
      blocked: data.blocked ?? false,
      category: data.category ?? null,
      visitedAt: data.visitedAt,
    },
  });
};

// ========== GET DEVICE BROWSER HISTORY
export const getDeviceBrowserHistory = async (parentId, deviceId) => {
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

  return prisma.browserHistory.findMany({
    where: {
      deviceId,
    },
    orderBy: {
      visitedAt: "desc",
    },
  });
};
