import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { prisma } from "../config/database.js";
import env from "../config/dotenv.js";

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

// ========== Parent registration ==========
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

// ========== User login ==========
export const loginUser = async (data, req) => {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
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

// ========== Refresh and rotate tokens ==========
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
