import crypto from "node:crypto";

import { prisma } from "../config/database.js";
import { generateDeviceTokens } from "./auth.service.js";

const generatePairingCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashPairingCode = (code) => {
  return crypto.createHash("sha256").update(code).digest("hex");
};

// Generate device pairing code
export const generateDevicePairingCode = async (parentId, childId) => {
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      parentId,
      role: "CHILD",
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!child) {
    throw new Error("Child not found or does not belong to this parent");
  }

  const pairingCode = generatePairingCode();
  const pairingCodeHash = hashPairingCode(pairingCode);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.devicePairing.create({
    data: {
      parentId,
      childId,
      pairingCodeHash,
      expiresAt,
    },
  });

  return {
    pairingCode,
    expiresAt,
  };
};

// Complete device pairing
export const completeDevicePairing = async (deviceData, req) => {
  const {
    pairingCode,
    deviceIdentifier,
    deviceName,
    platform,
    osVersion,
    appVersion,
  } = deviceData;

  const pairingCodeHash = hashPairingCode(pairingCode);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    // Find pending pairing
    const pairing = await tx.devicePairing.findFirst({
      where: {
        pairingCodeHash,
        status: "PENDING",
      },
      select: {
        id: true,
        childId: true,
        expiresAt: true,
      },
    });

    if (!pairing) {
      return { error: "Invalid or already used pairing code" };
    }

    // Check expiration
    if (pairing.expiresAt <= now) {
      await tx.devicePairing.update({
        where: { id: pairing.id },
        data: { status: "EXPIRED" },
      });

      return { error: "Pairing code has expired" };
    }

    // Create device
    const device = await tx.device.create({
      data: {
        childId: pairing.childId,
        deviceIdentifier,
        deviceName,
        platform,
        osVersion,
        appVersion,
      },
      select: {
        id: true,
        childId: true,
        deviceIdentifier: true,
        deviceName: true,
        platform: true,
        status: true,
        createdAt: true,
      },
    });

    // Complete pairing atomically
    const updated = await tx.devicePairing.updateMany({
      where: {
        id: pairing.id,
        status: "PENDING",
        expiresAt: { gt: now },
      },
      data: {
        deviceId: device.id,
        status: "COMPLETED",
        completedAt: now,
      },
    });

    if (updated.count !== 1) {
      throw new Error("Pairing code has already been used or expired");
    }

    // Generate device access and refresh tokens
    const tokens = await generateDeviceTokens(device, req, tx);

    return {
      device,
      ...tokens,
    };
  });

  if (result.error) {
    const error = new Error(result.error);
    error.statusCode = 400;
    throw error;
  }

  return result;
};
