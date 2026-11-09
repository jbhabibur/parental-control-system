import crypto from "node:crypto";

import env from "../config/dotenv.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// ========== Validate MFA Encryption Key ==========
const getEncryptionKey = () => {
  const key = Buffer.from(env.MFA_ENCRYPTION_KEY, "hex");

  if (key.length !== 32) {
    throw new Error("MFA encryption key must be exactly 32 bytes");
  }

  return key;
};

// ========== Encrypt MFA Secret ==========
export const encryptMfaSecret = (secret) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

// ========== Decrypt MFA Secret ==========
export const decryptMfaSecret = (encryptedSecret) => {
  const data = Buffer.from(encryptedSecret, "base64");

  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("Invalid encrypted MFA secret");
  }

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);

  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
};
