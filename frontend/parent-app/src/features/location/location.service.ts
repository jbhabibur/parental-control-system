/**
 * @file location.service.ts
 * @description Service layer for the Location feature.
 *
 * Responsibilities:
 *  1. Fetch the list of connected devices so the user can pick one.
 *  2. Fetch the most-recent (current) GPS fix for a selected device.
 *  3. Fetch the full location-history breadcrumb trail for a device.
 *
 * All network calls are delegated to the shared `api` gateway so that
 * auth-headers, base-URL, and error normalisation are handled centrally.
 */

import { ApiError, api } from "../../services/api";

// ─── Types ──────────────────────────────────────────────────────────────────

/** A device the parent has linked. Only the fields we need in this feature. */
export type DeviceOption = {
  id: string;
  deviceName: string;
};

/** A single GPS fix reported by a child device. */
export type LocationPoint = {
  id: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
};

// ─── Service Object ──────────────────────────────────────────────────────────

/**
 * `locationService` — stateless helper functions that call the backend.
 * The hook (`useLocation`) calls these and owns the resulting state.
 */
export const locationService = {
  /**
   * Load all devices linked to the authenticated parent account.
   * Returns an empty array when no devices exist (not an error).
   */
  async listDevices(): Promise<DeviceOption[]> {
    const result = await api.devices.list();
    return Array.isArray(result.data) ? (result.data as DeviceOption[]) : [];
  },

  /**
   * Load the most-recent GPS fix for `deviceId`.
   * Returns `null` when the device has never reported a location.
   */
  async getCurrentLocation(deviceId: string): Promise<LocationPoint | null> {
    const result = await api.location.current(deviceId);
    return (result.data as LocationPoint | null) ?? null;
  },

  /**
   * Load the full location-history trail for `deviceId`.
   * Returns an empty array when no history exists.
   */
  async getHistory(deviceId: string): Promise<LocationPoint[]> {
    const result = await api.location.history(deviceId);
    return Array.isArray(result.data) ? (result.data as LocationPoint[]) : [];
  },

  /** Normalise an unknown error into a human-readable string. */
  parseError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  },
};
