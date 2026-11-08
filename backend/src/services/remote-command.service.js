import { prisma } from "../config/database.js";

// ========== Create Remote Command (PARENT) ==========
export const createRemoteCommand = async (parentId, deviceId, data) => {
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
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.remoteCommand.create({
    data: {
      deviceId: device.id,
      childId: device.childId,
      issuedById: parentId,
      commandType: data.commandType,
      payload: data.payload ?? undefined,
      expiresAt: data.expiresAt ?? undefined,
    },
  });
};

// ========== Get Pending Commands (CHILD DEVICE) ==========
export const getPendingCommands = async (deviceId) => {
  return prisma.remoteCommand.findMany({
    where: {
      deviceId,
      status: "PENDING",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

// ========== Update Command Status (CHILD DEVICE) ==========
export const updateCommandStatus = async (deviceId, commandId, data) => {
  const command = await prisma.remoteCommand.findFirst({
    where: {
      id: commandId,
      deviceId,
    },
    select: {
      id: true,
      status: true,
      expiresAt: true,
    },
  });

  if (!command) {
    const error = new Error("Command not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    command.expiresAt &&
    command.expiresAt <= new Date() &&
    command.status !== "ACKNOWLEDGED"
  ) {
    return prisma.remoteCommand.update({
      where: {
        id: command.id,
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  return prisma.remoteCommand.update({
    where: {
      id: command.id,
    },
    data: {
      status: data.status,
      executedAt: data.status === "ACKNOWLEDGED" ? new Date() : undefined,
    },
  });
};

// ========== Get Device Command History (PARENT) ==========
export const getDeviceCommandHistory = async (parentId, deviceId) => {
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

  return prisma.remoteCommand.findMany({
    where: {
      deviceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
