import { prisma } from "../config/database.js";

// Get all permissions of a parent's child device
export const getDevicePermissions = async (parentId, deviceId) => {
  // Verify device ownership
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

  // Get device permissions
  const permissions = await prisma.devicePermission.findMany({
    where: {
      deviceId: device.id,
    },
    select: {
      id: true,
      deviceId: true,
      permissionType: true,
      allowed: true,
      updatedById: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      permissionType: "asc",
    },
  });

  return permissions;
};

// Update device permission
export const updateDevicePermission = async (
  parentId,
  deviceId,
  permissionId,
  allowed,
) => {
  // Verify device ownership
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

  // Verify permission belongs to device
  const permission = await prisma.devicePermission.findFirst({
    where: {
      id: permissionId,
      deviceId: device.id,
    },
    select: {
      id: true,
    },
  });

  if (!permission) {
    const error = new Error("Device permission not found");
    error.statusCode = 404;
    throw error;
  }

  // Update permission
  const updatedPermission = await prisma.devicePermission.update({
    where: {
      id: permission.id,
    },
    data: {
      allowed,
      updatedById: parentId,
    },
    select: {
      id: true,
      deviceId: true,
      permissionType: true,
      allowed: true,
      updatedById: true,
      updatedAt: true,
    },
  });

  return updatedPermission;
};
