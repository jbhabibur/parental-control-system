import { prisma } from "../config/database.js";
import { emitToChild } from "../config/socket.js";
import { normalizeDomain } from "../utils/domain.util.js";

const DEFAULT_DOH_ENDPOINT = "https://family.cloudflare-dns.com/dns-query";

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

  const policy = await prisma.dnsPolicy.create({
    data: {
      deviceId,
      enabled: data.enabled ?? true,
      provider: data.provider ?? null,
      dohEndpoint: data.dohEndpoint ?? null,
      dotEndpoint: data.dotEndpoint ?? null,
      safeSearch: data.safeSearch ?? true,
    },
  });

  emitToChild(deviceId, "dns:policy-updated", {
    deviceId,
    policy,
    updatedAt: new Date().toISOString(),
  });

  return policy;
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

  const updated = await prisma.dnsPolicy.update({
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

  emitToChild(deviceId, "dns:policy-updated", {
    deviceId,
    policy: updated,
    updatedAt: new Date().toISOString(),
  });

  return updated;
};

// ========== Add or Upsert Domain Rule (PARENT) ==========
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

  // Ensure a DNS policy exists so parents can block/unblock domains anytime
  const policy = await prisma.dnsPolicy.upsert({
    where: {
      deviceId,
    },
    update: {},
    create: {
      deviceId,
      enabled: true,
      safeSearch: true,
      provider: "ChildSafe Family DNS",
      dohEndpoint: DEFAULT_DOH_ENDPOINT,
    },
    select: {
      id: true,
    },
  });

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

  const normalizedDomain =
    normalizeDomain(data.domain) || data.domain.trim().toLowerCase();

  // Upsert allows seamless toggling between BLOCK and ALLOW anytime
  const rule = await prisma.domainRule.upsert({
    where: {
      dnsPolicyId_domain: {
        dnsPolicyId: policy.id,
        domain: normalizedDomain,
      },
    },
    update: {
      action: data.action,
      categoryId: data.categoryId ?? null,
    },
    create: {
      dnsPolicyId: policy.id,
      categoryId: data.categoryId ?? null,
      domain: normalizedDomain,
      action: data.action,
    },
  });

  // Notify child Safe Browser immediately so active pages obey live block/unblock
  emitToChild(deviceId, "dns:policy-updated", {
    deviceId,
    domain: rule.domain,
    action: rule.action,
    updatedAt: new Date().toISOString(),
  });

  return rule;
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

  const normalizedDomain =
    data.domain !== undefined
      ? normalizeDomain(data.domain) || data.domain.trim().toLowerCase()
      : undefined;

  const updated = await prisma.domainRule.update({
    where: {
      id: ruleId,
    },
    data: {
      ...(normalizedDomain !== undefined && {
        domain: normalizedDomain,
      }),
      ...(data.action !== undefined && {
        action: data.action,
      }),
      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
    },
  });

  emitToChild(deviceId, "dns:policy-updated", {
    deviceId,
    domain: updated.domain,
    action: updated.action,
    updatedAt: new Date().toISOString(),
  });

  return updated;
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
      domain: true,
    },
  });

  if (!rule) {
    const error = new Error("Domain rule not found");
    error.statusCode = 404;
    throw error;
  }

  const deleted = await prisma.domainRule.delete({
    where: {
      id: ruleId,
    },
  });

  emitToChild(deviceId, "dns:policy-updated", {
    deviceId,
    domain: rule.domain,
    action: "REMOVED",
    updatedAt: new Date().toISOString(),
  });

  return deleted;
};
