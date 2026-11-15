/**
 * ============================================================================
 * Feature: Activity - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Fetching enrolled devices
 * 2. Fetching app usage logs (appIdentifier, durationSeconds, startedAt)
 * 3. Fetching device events (foregroundApp, activityType, capturedAt)
 * 4. Fetching child web browsing history (pageTitle, domain, url, blocked, visitedAt)
 */

import { api } from "../../services/api";

export type ActivityRow = Record<string, unknown>;

export const activityService = {
  /**
   * Loads devices, and for the selected device, fetches app usage,
   * device activity events, and browser history.
   */
  getDeviceActivityData: async (deviceId: string) => {
    return await Promise.all([
      api.usage.list(deviceId),
      api.activity.list(deviceId),
      api.browserHistory.list(deviceId),
    ]);
  },

  getDevices: async () => {
    return await api.devices.list();
  },
};
