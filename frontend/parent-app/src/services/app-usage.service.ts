/**
 * ============================================================================
 * Services: App Usage Service
 * ============================================================================
 * Handles API calls related to device app usage and analytics.
 */

import { api } from "./api";

export interface AppUsageRecord {
  id: string;
  deviceId: string;
  appName: string;
  packageName: string;
  durationMinutes: number;
  lastUsedAt: string;
}

export interface AppUsageSummary {
  totalMinutes: number;
  appsCount: number;
  topApps: Array<{
    appName: string;
    durationMinutes: number;
    category?: string;
  }>;
}

export const appUsageService = {
  /**
   * Fetches app usage logs for a specific device.
   */
  getDeviceUsage: async (deviceId: string) => {
    return await api.usage.list(deviceId);
  },

  /**
   * Fetches summarized app usage for a specific device.
   */
  getDeviceUsageSummary: async (deviceId: string) => {
    return await api.usage.summary(deviceId);
  },
};
