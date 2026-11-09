import { prisma } from "../config/database.js";

// ========== Create Audit Log ==========
export const createAuditLog = async (
  {
    actorId,
    deviceId = null,
    action,
    entityType = null,
    entityId = null,
    metadata = null,
    ipAddress = null,
  },
  db = prisma,
) => {
  return db.auditLog.create({
    data: {
      actorId,
      deviceId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
    },
  });
};

// ========== Get Audit Logs ==========
export const getAuditLogs = async (parentId, filters = {}) => {
  const {
    deviceId,
    action,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = filters;

  const where = {
    actor: {
      OR: [
        { id: parentId, role: "PARENT" },
        { parentId, role: "CHILD" },
      ],
    },

    ...(deviceId && {
      deviceId,
      device: {
        is: {
          child: {
            parentId,
          },
        },
      },
    }),

    ...(action && { action }),

    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        device: {
          select: {
            id: true,
            deviceName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
