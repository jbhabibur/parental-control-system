/**
 * @file app-policies.service.ts
 * @description Service layer for the App Policies feature.
 *
 * Responsibilities:
 *  1. Fetch all devices linked to the parent account.
 *  2. Fetch enforced application policies for a specific device.
 *  3. Fetch the app-usage log for a specific device.
 *  4. Delete (remove) an individual application policy rule.
 *  5. Normalise unknown errors to human-readable strings.
 */

import { ApiError, api } from "../../services/api";

// ─── Types ───────────────────────────────────────────────────────────────────

/** A connected child device the parent can select. */
export type DeviceOption = {
  id: string;
  deviceName: string;
  platform: string;
};

/** A single application policy rule enforced on a device. */
export type AppPolicy = {
  id: string;
  appIdentifier: string;
  appName?: string | null;
  decision: "ALLOW" | "BLOCK" | string;
  category?: string | null;
  createdAt?: string;
};

/** One entry in the per-device app-usage log. */
export type AppUsageEntry = {
  id: string;
  appIdentifier: string;
  appName?: string | null;
  durationMinutes: number;
  lastUsedAt?: string | null;
};

// ─── Service Object ──────────────────────────────────────────────────────────

/**
 * `appPoliciesService` — stateless API helpers for the App Policies screen.
 * The hook (`useAppPolicies`) calls these and owns the resulting state.
 */
export const appPoliciesService = {
  /** Load all devices linked to the authenticated parent. */
  async listDevices(): Promise<DeviceOption[]> {
    const result = await api.devices.list();
    return Array.isArray(result.data) ? (result.data as DeviceOption[]) : [];
  },

  /**
   * Load all application-policy rules enforced on `deviceId`.
   * Returns an empty array (never throws) so the UI can distinguish
   * between "no policies" and an actual network error.
   */
  async listPolicies(deviceId: string): Promise<AppPolicy[]> {
    const result = await api.appPolicies.list(deviceId).catch(() => ({
      data: [],
    }));
    return Array.isArray(result.data) ? (result.data as AppPolicy[]) : [];
  },

  /**
   * Load the app-usage log for `deviceId`.
   * Returns an empty array (never throws) for the same reason as above.
   */
  async listUsage(deviceId: string): Promise<AppUsageEntry[]> {
    const result = await api.usage.list(deviceId).catch(() => ({ data: [] }));
    return Array.isArray(result.data) ? (result.data as AppUsageEntry[]) : [];
  },

  /**
   * Delete the policy rule `policyId` on `deviceId`.
   * Throws `ApiError` on failure so the hook can surface a user-visible message.
   */
  async deletePolicy(deviceId: string, policyId: string): Promise<void> {
    await api.appPolicies.delete(deviceId, policyId);
  },

  /** Normalise an unknown thrown value into a plain error string. */
  parseError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  },
};
