import { prisma } from "../config/database.js";

// ========== CREATE DNS POLICY ==========
export const createDnsPolicy = async (parentId, deviceId, data) => {
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

  const existingPolicy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
  });

  if (existingPolicy) {
    const error = new Error("DNS policy already exists for this device");
    error.statusCode = 409;
    throw error;
  }

  return prisma.dnsPolicy.create({
    data: {
      deviceId,
      enabled: data.enabled ?? true,
      provider: data.provider ?? null,
      dohEndpoint: data.dohEndpoint ?? null,
      dotEndpoint: data.dotEndpoint ?? null,
      safeSearch: data.safeSearch ?? true,
    },
  });
};

// ========== Get DNS Policy (PARENT) ==========
export const getDnsPolicy = async (parentId, deviceId) => {
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

  const policy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
    include: {
      domainRules: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!policy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  return policy;
};

// ========== Update DNS Policy (PARENT) ==========
export const updateDnsPolicy = async (parentId, deviceId, data) => {
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

  const existingPolicy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
  });

  if (!existingPolicy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.dnsPolicy.update({
    where: {
      deviceId,
    },
    data: {
      ...(data.enabled !== undefined && {
        enabled: data.enabled,
      }),
      ...(data.provider !== undefined && {
        provider: data.provider,
      }),
      ...(data.dohEndpoint !== undefined && {
        dohEndpoint: data.dohEndpoint,
      }),
      ...(data.dotEndpoint !== undefined && {
        dotEndpoint: data.dotEndpoint,
      }),
      ...(data.safeSearch !== undefined && {
        safeSearch: data.safeSearch,
      }),
    },
  });
};

// ========== Add Domain Rule (PARENT) ==========
export const addDomainRule = async (parentId, deviceId, data) => {
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

  const policy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
    select: {
      id: true,
    },
  });

  if (!policy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.domainCategory.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      const error = new Error("Domain category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.domainRule.create({
    data: {
      dnsPolicyId: policy.id,
      categoryId: data.categoryId ?? null,
      domain: data.domain,
      action: data.action,
    },
  });
};

// ========== Get Domain Rules (PARENT) ==========
export const getDomainRules = async (parentId, deviceId) => {
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

  const policy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
    select: {
      id: true,
    },
  });

  if (!policy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.domainRule.findMany({
    where: {
      dnsPolicyId: policy.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// =========== Update Domain Rule (PARENT) ==========
export const updateDomainRule = async (parentId, deviceId, ruleId, data) => {
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

  const policy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
    select: {
      id: true,
    },
  });

  if (!policy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  const rule = await prisma.domainRule.findFirst({
    where: {
      id: ruleId,
      dnsPolicyId: policy.id,
    },
  });

  if (!rule) {
    const error = new Error("Domain rule not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.domainCategory.findUnique({
      where: {
        id: data.categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      const error = new Error("Domain category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.domainRule.update({
    where: {
      id: ruleId,
    },
    data: {
      ...(data.domain !== undefined && {
        domain: data.domain,
      }),
      ...(data.action !== undefined && {
        action: data.action,
      }),
      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
    },
  });
};

// ========== DELETE DOMAIN RULE (PARENT) ==========
export const deleteDomainRule = async (parentId, deviceId, ruleId) => {
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

  const policy = await prisma.dnsPolicy.findUnique({
    where: {
      deviceId,
    },
    select: {
      id: true,
    },
  });

  if (!policy) {
    const error = new Error("DNS policy not found");
    error.statusCode = 404;
    throw error;
  }

  const rule = await prisma.domainRule.findFirst({
    where: {
      id: ruleId,
      dnsPolicyId: policy.id,
    },
    select: {
      id: true,
    },
  });

  if (!rule) {
    const error = new Error("Domain rule not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.domainRule.delete({
    where: {
      id: ruleId,
    },
  });
};
