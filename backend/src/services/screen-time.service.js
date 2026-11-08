import { prisma } from "../config/database.js";

// ========== Get screen time policy of parent's child device ==========
export const getScreenTimePolicy = async (parentId, deviceId) => {
  const policy = await prisma.screenTimePolicy.findFirst({
    where: {
      deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
      childId: true,
      deviceId: true,
      enabled: true,
      dailyLimitMinutes: true,
      bedtimeStart: true,
      bedtimeEnd: true,
      timezone: true,
      updatedById: true,
      perAppLimits: {
        select: {
          id: true,
          appIdentifier: true,
          limitMinutes: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!policy) {
    const error = new Error("Screen time policy not found");
    error.statusCode = 404;
    throw error;
  }

  return policy;
};

// ========= Create screen time policy for parent's child device ==========
export const createScreenTimePolicy = async (parentId, deviceId, data) => {
  const { enabled, dailyLimitMinutes, bedtimeStart, bedtimeEnd, timezone } =
    data;

  // Verify device belongs to parent's child
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  // Check existing policy
  const existingPolicy = await prisma.screenTimePolicy.findUnique({
    where: {
      deviceId,
    },
  });

  if (existingPolicy) {
    const error = new Error("Screen time policy already exists");
    error.statusCode = 409;
    throw error;
  }

  return await prisma.screenTimePolicy.create({
    data: {
      childId: device.childId,
      deviceId,
      enabled: enabled ?? true,
      dailyLimitMinutes,
      bedtimeStart: bedtimeStart ?? null,
      bedtimeEnd: bedtimeEnd ?? null,
      timezone: timezone ?? "Asia/Dhaka",
      updatedById: parentId,
    },
  });
};

// ========= Update screen time policy for parent's child device ==========
export const updateScreenTimePolicy = async (parentId, deviceId, data) => {
  // Find policy belonging to parent's child
  const policy = await prisma.screenTimePolicy.findFirst({
    where: {
      deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
  });

  if (!policy) {
    const error = new Error("Screen time policy not found");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.screenTimePolicy.update({
    where: {
      id: policy.id,
    },
    data: {
      ...data,
      updatedById: parentId,
    },
  });
};

// ========= Get per-app limits for parent's child device ==========
export const getPerAppLimits = async (parentId, deviceId) => {
  const policy = await prisma.screenTimePolicy.findFirst({
    where: {
      deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
      deviceId: true,
      perAppLimits: {
        select: {
          id: true,
          appIdentifier: true,
          limitMinutes: true,
        },
      },
    },
  });

  if (!policy) {
    const error = new Error("Screen time policy not found");
    error.statusCode = 404;
    throw error;
  }

  return policy.perAppLimits;
};

// ======== Create per-app limit for parent's child device ==========
export const createPerAppLimit = async (
  parentId,
  deviceId,
  appIdentifier,
  limitMinutes,
) => {
  // Verify the device belongs to parent's child
  const policy = await prisma.screenTimePolicy.findFirst({
    where: {
      deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
  });

  if (!policy) {
    const error = new Error("Screen time policy not found");
    error.statusCode = 404;
    throw error;
  }

  // Check whether this app already has a limit
  const existingLimit = await prisma.perAppLimit.findUnique({
    where: {
      screenTimePolicyId_appIdentifier: {
        screenTimePolicyId: policy.id,
        appIdentifier,
      },
    },
  });

  if (existingLimit) {
    const error = new Error("App limit already exists");
    error.statusCode = 409;
    throw error;
  }

  return await prisma.perAppLimit.create({
    data: {
      screenTimePolicyId: policy.id,
      appIdentifier,
      limitMinutes,
    },
  });
};

// ======== Update per-app limit for parent's child device ==========
export const updatePerAppLimit = async (
  parentId,
  deviceId,
  limitId,
  limitMinutes,
) => {
  // Verify app limit belongs to parent's child device
  const appLimit = await prisma.perAppLimit.findFirst({
    where: {
      id: limitId,
      screenTimePolicy: {
        deviceId,
        child: {
          parentId,
          role: "CHILD",
        },
      },
    },
  });

  if (!appLimit) {
    const error = new Error("Per-app limit not found");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.perAppLimit.update({
    where: {
      id: appLimit.id,
    },
    data: {
      limitMinutes,
    },
  });
};

// ======== Delete Per-App Limit ==========
export const deletePerAppLimit = async (parentId, deviceId, limitId) => {
  // Verify app limit belongs to parent's child device
  const appLimit = await prisma.perAppLimit.findFirst({
    where: {
      id: limitId,
      screenTimePolicy: {
        deviceId,
        child: {
          parentId,
          role: "CHILD",
        },
      },
    },
  });

  if (!appLimit) {
    const error = new Error("Per-app limit not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.perAppLimit.delete({
    where: {
      id: appLimit.id,
    },
  });

  return appLimit;
};
