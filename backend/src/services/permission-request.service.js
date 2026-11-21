import { prisma } from "../config/database.js";
import { emitToParent, emitToChild } from "../config/socket.js";
import { normalizeDomain } from "../utils/domain.util.js";

const DEFAULT_DOH_ENDPOINT = "https://family.cloudflare-dns.com/dns-query";

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
      deviceName: true,
      child: {
        select: {
          id: true,
          name: true,
          parentId: true,
        },
      },
    },
  });

  if (!device) {
    const error = new Error("Device not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  // Normalize domain if this is a DOMAIN_ACCESS request
  const normalizedResource =
    requestType === "DOMAIN_ACCESS"
      ? normalizeDomain(resource) || resource.trim().toLowerCase()
      : resource;

  // Avoid duplicate PENDING requests for the exact same resource
  const existingPending = await prisma.permissionRequest.findFirst({
    where: {
      childId,
      deviceId: device.id,
      requestType,
      resource: normalizedResource,
      status: "PENDING",
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

  if (existingPending) {
    return existingPending;
  }

  // Create permission request
  const permissionRequest = await prisma.permissionRequest.create({
    data: {
      childId,
      deviceId: device.id,
      requestType,
      resource: normalizedResource,
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

  // Notify Parent in DB + via real-time Socket.IO
  const parentId = device.child?.parentId;
  if (parentId) {
    const childName = device.child?.name || "Your child";
    const isDomain = requestType === "DOMAIN_ACCESS";

    await prisma.notification.create({
      data: {
        userId: parentId,
        title: isDomain
          ? `Website Access Request: ${normalizedResource}`
          : `Permission Request: ${normalizedResource}`,
        body: `${childName} (${device.deviceName}) requested access to ${normalizedResource}.${reason ? ` Reason: ${reason}` : ""}`,
        channel: "IN_APP",
      },
    });

    emitToParent(parentId, "permission:requested", {
      ...permissionRequest,
      child: { id: childId, name: childName },
      device: { id: device.id, deviceName: device.deviceName },
    });
  }

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
      child: {
        select: {
          id: true,
          name: true,
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
  });

  return requests;
};

// ========== Approve permission request ==========
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

  // Update request and related permission / DNS domain rule atomically
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

    // Automatically upsert an ALLOW domain rule in DnsPolicy when parent approves a website
    if (request.requestType === "DOMAIN_ACCESS") {
      const domain =
        normalizeDomain(request.resource) ||
        request.resource.trim().toLowerCase();

      const dnsPolicy = await tx.dnsPolicy.upsert({
        where: { deviceId: request.deviceId },
        update: {},
        create: {
          deviceId: request.deviceId,
          enabled: true,
          safeSearch: true,
          provider: "ChildSafe Family DNS",
          dohEndpoint: DEFAULT_DOH_ENDPOINT,
        },
      });

      await tx.domainRule.upsert({
        where: {
          dnsPolicyId_domain: {
            dnsPolicyId: dnsPolicy.id,
            domain,
          },
        },
        update: {
          action: "ALLOW",
        },
        create: {
          dnsPolicyId: dnsPolicy.id,
          domain,
          action: "ALLOW",
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

  // Notify child device in real time so Safe Browser reloads immediately
  emitToChild(updatedRequest.deviceId, "permission:resolved", updatedRequest);
  if (updatedRequest.requestType === "DOMAIN_ACCESS") {
    emitToChild(updatedRequest.deviceId, "dns:policy-updated", {
      deviceId: updatedRequest.deviceId,
      domain: updatedRequest.resource,
      action: "ALLOW",
      updatedAt: new Date().toISOString(),
    });
  }

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

  // Deny request (and enforce BLOCK rule if DOMAIN_ACCESS) atomically
  const updatedRequest = await prisma.$transaction(async (tx) => {
    if (request.requestType === "DOMAIN_ACCESS") {
      const domain =
        normalizeDomain(request.resource) ||
        request.resource.trim().toLowerCase();

      const dnsPolicy = await tx.dnsPolicy.upsert({
        where: { deviceId: request.deviceId },
        update: {},
        create: {
          deviceId: request.deviceId,
          enabled: true,
          safeSearch: true,
          provider: "ChildSafe Family DNS",
          dohEndpoint: DEFAULT_DOH_ENDPOINT,
        },
      });

      await tx.domainRule.upsert({
        where: {
          dnsPolicyId_domain: {
            dnsPolicyId: dnsPolicy.id,
            domain,
          },
        },
        update: {
          action: "BLOCK",
        },
        create: {
          dnsPolicyId: dnsPolicy.id,
          domain,
          action: "BLOCK",
        },
      });
    }

    return await tx.permissionRequest.update({
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
  });

  // Notify child device in real time so Safe Browser shows Blocked page
  emitToChild(updatedRequest.deviceId, "permission:resolved", updatedRequest);
  if (updatedRequest.requestType === "DOMAIN_ACCESS") {
    emitToChild(updatedRequest.deviceId, "dns:policy-updated", {
      deviceId: updatedRequest.deviceId,
      domain: updatedRequest.resource,
      action: "BLOCK",
      updatedAt: new Date().toISOString(),
    });
  }

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
