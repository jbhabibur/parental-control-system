/**
 * ============================================================================
 * Feature: Security - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Two-factor authentication (2FA/MFA) setup, enable, and disable
 * 2. Audit logs retrieval for administrative logins & security modifications
 */

import { api, getStored, setStored } from "../../services/api";

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType?: string;
  ipAddress?: string | null;
  createdAt: string;
}

export const securityService = {
  /**
   * Fetches overall security state: MFA status, audit logs, and biometric preferences.
   */
  loadSecurityProfile: async () => {
    const [mfaStatusRes, logsRes, bioPref] = await Promise.all([
      api.mfa.status().catch(() => ({ data: { enabled: false } })),
      api.auditLogs({ limit: 8 }).catch(() => ({ data: { logs: [] } })),
      getStored("parent-control.pref.biometric"),
    ]);

    const statusData = mfaStatusRes.data as { enabled?: boolean } | undefined;
    const logsData = logsRes.data as { logs?: AuditLogEntry[] } | undefined;

    return {
      mfaEnabled: Boolean(statusData?.enabled),
      auditLogs: Array.isArray(logsData?.logs) ? logsData!.logs! : [],
      biometricsEnabled: bioPref === "true",
    };
  },

  /**
   * Initiates 2FA setup and returns QR code and TOTP secret.
   */
  setupMfa: async () => {
    return await api.mfa.setup();
  },

  /**
   * Confirms and activates 2FA with a valid TOTP code.
   */
  enableMfa: async (token: string) => {
    return await api.mfa.enable(token);
  },

  /**
   * Disables 2FA with password confirmation.
   */
  disableMfa: async (password: string, token: string) => {
    return await api.mfa.disable(password, token);
  },

  /**
   * Toggles biometric preference.
   */
  setBiometrics: async (enabled: boolean) => {
    await setStored("parent-control.pref.biometric", enabled ? "true" : "false");
  },
};
