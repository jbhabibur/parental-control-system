import { prisma } from "../config/database.js";

// ========== Create Security Alert
export const createSecurityAlert = async (deviceId, childId, data) => {
  return prisma.securityAlert.create({
    data: {
      childId,
      deviceId,
      type: data.type,
      severity: data.severity ?? "MEDIUM",
      title: data.title,
      description: data.description ?? null,
      metadata: data.metadata ?? undefined,
    },
  });
};

// ========== Get All Security Alerts
export const getAllSecurityAlerts = async (parentId) => {
  return prisma.securityAlert.findMany({
    where: {
      child: {
        parentId,
        role: "CHILD",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ========== Get Single Security Alert ==========
export const getSecurityAlertById = async (parentId, alertId) => {
  const alert = await prisma.securityAlert.findFirst({
    where: {
      id: alertId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
  });

  if (!alert) {
    const error = new Error("Security alert not found");
    error.statusCode = 404;
    throw error;
  }

  return alert;
};

// ========== Acknowledge Security Alert ==========
export const acknowledgeSecurityAlert = async (parentId, alertId) => {
  const alert = await prisma.securityAlert.findFirst({
    where: {
      id: alertId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    select: {
      id: true,
    },
  });

  if (!alert) {
    const error = new Error("Security alert not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.securityAlert.update({
    where: {
      id: alertId,
    },
    data: {
      acknowledgedAt: new Date(),
    },
  });
};
