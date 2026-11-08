import { prisma } from "../config/database.js";

// Get all devices of parent's children
export const getParentDevices = async (parentId) => {
  const devices = await prisma.device.findMany({
    where: {
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
      childId: true,
      deviceIdentifier: true,
      deviceName: true,
      platform: true,
      osVersion: true,
      appVersion: true,
      status: true,
      lastSeenAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return devices;
};

// Get device details
export const getParentDeviceById = async (parentId, deviceId) => {
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
      childId: true,
      deviceIdentifier: true,
      deviceName: true,
      platform: true,
      osVersion: true,
      appVersion: true,
      status: true,
      lastSeenAt: true,
      lastIpAddress: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return device;
};

// Update device status
export const updateParentDeviceStatus = async (parentId, deviceId, status) => {
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

  const updatedDevice = await prisma.device.update({
    where: {
      id: device.id,
    },
    data: {
      status,
    },
    select: {
      id: true,
      childId: true,
      deviceName: true,
      platform: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedDevice;
};

// Remove device
export const removeParentDevice = async (parentId, deviceId) => {
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
      status: true,
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  if (device.status === "REMOVED") {
    const error = new Error("Device has already been removed");
    error.statusCode = 400;
    throw error;
  }

  const removedDevice = await prisma.device.update({
    where: {
      id: device.id,
    },
    data: {
      status: "REMOVED",
    },
    select: {
      id: true,
      childId: true,
      deviceName: true,
      status: true,
      updatedAt: true,
    },
  });

  return removedDevice;
};
