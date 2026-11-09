import { prisma } from "../config/database.js";

// ========== CREATE APP POLICY ==========
export const createAppPolicy = async (parentId, deviceId, data) => {
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

  return prisma.appPolicy.create({
    data: {
      deviceId,
      appIdentifier: data.appIdentifier,
      appName: data.appName ?? null,
      decision: data.decision,
      category: data.category ?? null,
    },
  });
};

// ========== GET ALL APP POLICIES ==========
export const getAllAppPolicies = async (parentId, deviceId) => {
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

  return prisma.appPolicy.findMany({
    where: {
      deviceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ========== UPDATE APP POLICY ==========
export const updateAppPolicy = async (parentId, deviceId, policyId, data) => {
  const policy = await prisma.appPolicy.findFirst({
    where: {
      id: policyId,
      deviceId,
      device: {
        child: {
          parentId,
          role: "CHILD",
        },
      },
    },
  });

  if (!policy) {
    const error = new Error("App policy not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.appPolicy.update({
    where: {
      id: policyId,
    },
    data: {
      appIdentifier: data.appIdentifier,
      appName: data.appName,
      decision: data.decision,
      category: data.category,
    },
  });
};

// ========== DELETE APP POLICY ==========
export const deleteAppPolicy = async (parentId, deviceId, policyId) => {
  const policy = await prisma.appPolicy.findFirst({
    where: {
      id: policyId,
      deviceId,
      device: {
        child: {
          parentId,
          role: "CHILD",
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!policy) {
    const error = new Error("App policy not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.appPolicy.delete({
    where: {
      id: policyId,
    },
  });
};
