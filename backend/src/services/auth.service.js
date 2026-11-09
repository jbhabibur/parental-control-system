import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { verify } from "otplib";

import { prisma } from "../config/database.js";
import env from "../config/dotenv.js";
import { decryptMfaSecret } from "../utils/mfa-encryption.js";

class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ========== Generate User Tokens ==========
const generateTokens = async (user, req, db = prisma) => {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      tokenType: "refresh",
      jti: crypto.randomUUID(),
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );

  const decoded = jwt.decode(refreshToken);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    },
  });

  return { accessToken, refreshToken };
};

// ========== Generate MFA Challenge Token ==========
const generateMfaChallenge = async (user, req, db = prisma) => {
  const challengeToken = jwt.sign(
    {
      sub: user.id,
      role: "PARENT",
      tokenType: "mfa_challenge",
      jti: crypto.randomUUID(),
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: "5m" },
  );

  const decoded = jwt.decode(challengeToken);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(challengeToken),
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    },
  });

  return {
    mfaRequired: true,
    challengeToken,
    expiresIn: 300,
  };
};

// ========== Generate Device Tokens ==========
export const generateDeviceTokens = async (device, req, db = prisma) => {
  const accessToken = jwt.sign(
    {
      sub: device.childId,
      role: "CHILD",
      deviceId: device.id,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  const refreshToken = jwt.sign(
    {
      sub: device.childId,
      role: "CHILD",
      deviceId: device.id,
      tokenType: "refresh",
      jti: crypto.randomUUID(),
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );

  const decoded = jwt.decode(refreshToken);

  await db.refreshToken.create({
    data: {
      userId: device.childId,
      deviceId: device.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

// ========== Parent Registration ==========
export const registerUser = async (data, req) => {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AuthError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "PARENT",
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      const tokens = await generateTokens(user, req, tx);

      return { user, ...tokens };
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new AuthError("Email already registered", 409);
    }

    throw error;
  }
};

// ========== User Login ==========
export const loginUser = async (data, req) => {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      mfa: true,
    },
  });

  if (!user || !user.passwordHash) {
    throw new AuthError("Invalid email or password", 401);
  }

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);

  if (!passwordMatch) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AuthError("Account is not active", 403);
  }

  // ========== Parent MFA Verification Required ==========
  if (user.role === "PARENT" && user.mfa?.enabled) {
    if (!user.mfa.secretEncrypted) {
      throw new AuthError("MFA configuration is invalid", 401);
    }

    const challenge = await generateMfaChallenge(user, req);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...challenge,
    };
  }

  const tokens = await generateTokens(user, req);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    ...tokens,
  };
};

// ========== Verify MFA Login ==========
export const verifyLoginMfa = async (challengeToken, token, req) => {
  if (!/^\d{6}$/.test(token)) {
    throw new AuthError("OTP must be exactly 6 digits", 400);
  }

  let decoded;

  try {
    decoded = jwt.verify(challengeToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AuthError("Invalid or expired MFA challenge token", 401);
  }

  if (
    decoded.tokenType !== "mfa_challenge" ||
    decoded.role !== "PARENT" ||
    !decoded.sub
  ) {
    throw new AuthError("Invalid MFA challenge token", 401);
  }

  const challengeHash = hashToken(challengeToken);

  const storedChallenge = await prisma.refreshToken.findUnique({
    where: { tokenHash: challengeHash },
    include: {
      user: {
        include: {
          mfa: true,
        },
      },
    },
  });

  if (
    !storedChallenge ||
    storedChallenge.revokedAt ||
    storedChallenge.expiresAt <= new Date() ||
    storedChallenge.userId !== decoded.sub ||
    storedChallenge.user.status !== "ACTIVE" ||
    storedChallenge.user.role !== "PARENT" ||
    !storedChallenge.user.mfa?.enabled ||
    !storedChallenge.user.mfa.secretEncrypted
  ) {
    throw new AuthError("MFA challenge is invalid or expired", 401);
  }

  const secret = decryptMfaSecret(storedChallenge.user.mfa.secretEncrypted);

  const result = await verify({
    secret,
    token,
    algorithm: "sha1",
    digits: 6,
    period: 30,
    epochTolerance: 30,
  });

  if (!result.valid) {
    throw new AuthError("Invalid or expired OTP", 401);
  }

  // ========== Consume MFA Challenge Once ==========
  try {
    return await prisma.$transaction(async (tx) => {
      const consumed = await tx.refreshToken.updateMany({
        where: {
          id: storedChallenge.id,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (consumed.count !== 1) {
        throw new AuthError("MFA challenge has already been used", 401);
      }

      const tokens = await generateTokens(storedChallenge.user, req, tx);

      return {
        user: {
          id: storedChallenge.user.id,
          name: storedChallenge.user.name,
          email: storedChallenge.user.email,
          role: storedChallenge.user.role,
        },
        ...tokens,
      };
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw error;
  }
};

// ========== Refresh and Rotate Tokens ==========
export const refreshUserToken = async (token, req) => {
  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  if (decoded.tokenType !== "refresh") {
    throw new AuthError("Invalid refresh token", 401);
  }

  const tokenHash = hashToken(token);

  try {
    return await prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date() ||
        storedToken.user.status !== "ACTIVE"
      ) {
        throw new AuthError("Refresh token is invalid or expired", 401);
      }

      const revoked = await tx.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revoked.count !== 1) {
        throw new AuthError("Refresh token already used", 401);
      }

      return generateTokens(storedToken.user, req, tx);
    });
  } catch (error) {
    if (error instanceof AuthError) throw error;

    throw new AuthError("Invalid or expired refresh token", 401);
  }
};

// ========== Logout ==========
export const logoutUser = async (token) => {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(token),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

// ========== Device Refresh and Rotate Tokens ==========
export const refreshDeviceToken = async (token, req) => {
  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AuthError("Invalid or expired device refresh token", 401);
  }

  if (
    decoded.tokenType !== "refresh" ||
    decoded.role !== "CHILD" ||
    !decoded.deviceId
  ) {
    throw new AuthError("Invalid device refresh token", 401);
  }

  const tokenHash = hashToken(token);

  try {
    return await prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findUnique({
        where: { tokenHash },
        include: {
          user: true,
          device: true,
        },
      });

      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date() ||
        !storedToken.device ||
        storedToken.deviceId !== decoded.deviceId ||
        storedToken.userId !== decoded.sub ||
        storedToken.device.childId !== storedToken.userId ||
        storedToken.user.status !== "ACTIVE" ||
        storedToken.user.role !== "CHILD" ||
        storedToken.device.status === "LOCKED" ||
        storedToken.device.status === "PAUSED" ||
        storedToken.device.status === "REMOVED"
      ) {
        throw new AuthError("Device refresh token is invalid or expired", 401);
      }

      const revoked = await tx.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revoked.count !== 1) {
        throw new AuthError("Device refresh token already used", 401);
      }

      return generateDeviceTokens(storedToken.device, req, tx);
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("Invalid or expired device refresh token", 401);
  }
};

// ========== Device Logout ==========
export const logoutDevice = async (token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AuthError("Invalid or expired device refresh token", 401);
  }

  if (
    decoded.tokenType !== "refresh" ||
    decoded.role !== "CHILD" ||
    !decoded.deviceId
  ) {
    throw new AuthError("Invalid device refresh token", 401);
  }

  const tokenHash = hashToken(token);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (
    !storedToken ||
    storedToken.deviceId !== decoded.deviceId ||
    storedToken.userId !== decoded.sub ||
    storedToken.revokedAt
  ) {
    throw new AuthError("Device refresh token is invalid", 401);
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      revokedAt: new Date(),
    },
  });
};
