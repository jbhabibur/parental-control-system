import { prisma } from "../config/database.js";

// ========== Create permission request from child device ==========
export const createPermissionRequest = async (
  childId,
  deviceId,
  requestType,
  resource,
  reason,
) => {
  // Verify device belongs to the child
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      childId,
      status: "ACTIVE",
      child: {
        role: "CHILD",
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  // Create permission request
  const permissionRequest = await prisma.permissionRequest.create({
    data: {
      childId,
      deviceId: device.id,
      requestType,
      resource,
      reason,
    },
    select: {
      id: true,
      childId: true,
      deviceId: true,
      requestType: true,
      resource: true,
      reason: true,
      status: true,
      createdAt: true,
    },
  });

  return permissionRequest;
};

// ========== Get all permission requests of parent's children ==========
export const getParentPermissionRequests = async (parentId) => {
  const requests = await prisma.permissionRequest.findMany({
    where: {
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
      childId: true,
      deviceId: true,
      requestType: true,
      resource: true,
      reason: true,
      status: true,
      reviewedById: true,
      reviewedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

// ========== Approve permission request ==========

// Approve permission request
export const approvePermissionRequest = async (parentId, requestId) => {
  const request = await prisma.permissionRequest.findFirst({
    where: {
      id: requestId,
      status: "PENDING",
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
      deviceId: true,
      requestType: true,
      resource: true,
    },
  });

  if (!request) {
    const error = new Error("Pending permission request not found");
    error.statusCode = 404;
    throw error;
  }

  const permissionTypes = [
    "CAMERA",
    "MICROPHONE",
    "LOCATION",
    "STORAGE",
    "CONTACTS",
    "NOTIFICATIONS",
    "OTHER",
  ];

  if (
    request.requestType === "HARDWARE_PERMISSION" &&
    !permissionTypes.includes(request.resource)
  ) {
    const error = new Error("Invalid hardware permission resource");
    error.statusCode = 400;
    throw error;
  }

  // Update request and device permission atomically
  const updatedRequest = await prisma.$transaction(async (tx) => {
    if (request.requestType === "HARDWARE_PERMISSION") {
      await tx.devicePermission.upsert({
        where: {
          deviceId_permissionType: {
            deviceId: request.deviceId,
            permissionType: request.resource,
          },
        },
        update: {
          allowed: true,
          updatedById: parentId,
        },
        create: {
          deviceId: request.deviceId,
          permissionType: request.resource,
          allowed: true,
          updatedById: parentId,
        },
      });
    }

    return await tx.permissionRequest.update({
      where: {
        id: request.id,
      },
      data: {
        status: "APPROVED",
        reviewedById: parentId,
        reviewedAt: new Date(),
      },
      select: {
        id: true,
        childId: true,
        deviceId: true,
        requestType: true,
        resource: true,
        status: true,
        reviewedById: true,
        reviewedAt: true,
        updatedAt: true,
      },
    });
  });

  return updatedRequest;
};

// ========== Deny permission request ==========
export const denyPermissionRequest = async (parentId, requestId) => {
  // Verify request belongs to parent's child
  const request = await prisma.permissionRequest.findFirst({
    where: {
      id: requestId,
      status: "PENDING",
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
    },
  });

  if (!request) {
    const error = new Error("Pending permission request not found");
    error.statusCode = 404;
    throw error;
  }

  // Deny request
  const updatedRequest = await prisma.permissionRequest.update({
    where: {
      id: request.id,
    },
    data: {
      status: "DENIED",
      reviewedById: parentId,
      reviewedAt: new Date(),
    },
    select: {
      id: true,
      childId: true,
      deviceId: true,
      requestType: true,
      resource: true,
      reason: true,
      status: true,
      reviewedById: true,
      reviewedAt: true,
      updatedAt: true,
    },
  });

  return updatedRequest;
};

// ========== Get permission requests of child device ==========
export const getChildPermissionRequests = async (childId, deviceId) => {
  const requests = await prisma.permissionRequest.findMany({
    where: {
      childId,
      deviceId,
    },
    select: {
      id: true,
      requestType: true,
      resource: true,
      reason: true,
      status: true,
      reviewedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};
