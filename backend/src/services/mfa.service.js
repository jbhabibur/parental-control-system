import bcrypt from "bcrypt";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

import { prisma } from "../config/database.js";
import { encryptMfaSecret, decryptMfaSecret } from "../utils/mfa-encryption.js";

// ========== Validate Parent Account ==========
const validateParent = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      status: true,
    },
  });

  if (!user || user.role !== "PARENT" || user.status !== "ACTIVE") {
    throw new Error("Active parent account not found");
  }

  return user;
};

// ========== Verify OTP ==========
const verifyMfaToken = async (secret, token) => {
  if (!/^\d{6}$/.test(token)) {
    throw new Error("OTP must be exactly 6 digits");
  }

  const result = await verify({
    secret,
    token,
    algorithm: "sha1",
    digits: 6,
    period: 30,
    epochTolerance: 30,
  });

  return result.valid;
};

// ========== Generate MFA Setup ==========
export const setupMfa = async (userId) => {
  const user = await validateParent(userId);

  if (!user.email) {
    throw new Error("Email is required for MFA setup");
  }

  const existingMfa = await prisma.mfaConfiguration.findUnique({
    where: { userId },
  });

  if (existingMfa?.enabled) {
    throw new Error("MFA is already enabled");
  }

  const secret = generateSecret();

  const otpauthUrl = generateURI({
    issuer: "Parental Control System",
    label: user.email,
    secret,
    algorithm: "sha1",
    digits: 6,
    period: 30,
  });

  const qrCode = await QRCode.toDataURL(otpauthUrl);

  const secretEncrypted = encryptMfaSecret(secret);

  await prisma.mfaConfiguration.upsert({
    where: { userId },
    create: {
      userId,
      secretEncrypted,
      enabled: false,
      confirmedAt: null,
      recoveryCodesHash: null,
    },
    update: {
      secretEncrypted,
      enabled: false,
      confirmedAt: null,
      recoveryCodesHash: null,
    },
  });

  return {
    qrCode,
    secret,
    message:
      "Scan the QR code with your authenticator app, then verify the OTP to enable MFA",
  };
};

// ========== Verify and Enable MFA ==========
export const enableMfa = async (userId, token) => {
  await validateParent(userId);

  const mfa = await prisma.mfaConfiguration.findUnique({
    where: { userId },
  });

  if (!mfa || !mfa.secretEncrypted) {
    throw new Error("MFA setup not found");
  }

  if (mfa.enabled) {
    throw new Error("MFA is already enabled");
  }

  const secret = decryptMfaSecret(mfa.secretEncrypted);

  const isValid = await verifyMfaToken(secret, token);

  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  const updatedMfa = await prisma.mfaConfiguration.update({
    where: { userId },
    data: {
      enabled: true,
      confirmedAt: new Date(),
    },
    select: {
      enabled: true,
      confirmedAt: true,
    },
  });

  return updatedMfa;
};

// ========== Get MFA Status ==========
export const getMfaStatus = async (userId) => {
  await validateParent(userId);

  const mfa = await prisma.mfaConfiguration.findUnique({
    where: { userId },
    select: {
      enabled: true,
      confirmedAt: true,
    },
  });

  return {
    enabled: mfa?.enabled ?? false,
    confirmedAt: mfa?.confirmedAt ?? null,
  };
};

// ========== Disable MFA ==========
export const disableMfa = async (userId, password, token) => {
  const user = await validateParent(userId);

  if (!user.passwordHash) {
    throw new Error("Password verification is unavailable");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const mfa = await prisma.mfaConfiguration.findUnique({
    where: { userId },
  });

  if (!mfa || !mfa.enabled || !mfa.secretEncrypted) {
    throw new Error("MFA is not enabled");
  }

  const secret = decryptMfaSecret(mfa.secretEncrypted);

  const isValid = await verifyMfaToken(secret, token);

  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  await prisma.mfaConfiguration.update({
    where: { userId },
    data: {
      enabled: false,
      secretEncrypted: null,
      confirmedAt: null,
      recoveryCodesHash: null,
    },
  });

  return {
    enabled: false,
    message: "MFA disabled successfully",
  };
};
