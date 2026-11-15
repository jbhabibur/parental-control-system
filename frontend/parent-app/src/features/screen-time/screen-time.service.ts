/**
 * ============================================================================
 * Feature: Screen Time - Service Layer
 * ============================================================================
 * Handles backend API integration for:
 * 1. Fetching connected devices
 * 2. Fetching and persisting screen-time policies (daily limit, bedtime curfews)
 * 3. Fetching, creating, and removing per-app time quotas
 * 4. Queuing remote pause commands
 */

import { api } from "../../services/api";

export type DeviceOption = { id: string; deviceName: string };

export type AppLimit = {
  id: string;
  appIdentifier: string;
  limitMinutes: number;
};

export type Policy = {
  id?: string;
  enabled: boolean;
  dailyLimitMinutes: number;
  bedtimeStart?: string | null;
  bedtimeEnd?: string | null;
  timezone?: string;
};

export const screenTimeService = {
  /**
   * Fetches the list of enrolled child devices.
   */
  getDevices: async (): Promise<DeviceOption[]> => {
    const result = await api.devices.list();
    return Array.isArray(result.data) ? (result.data as DeviceOption[]) : [];
  },

  /**
   * Fetches the current screen-time policy for a specific device.
   */
  getPolicy: async (deviceId: string) => {
    return await api.screenTime.get(deviceId);
  },

  /**
   * Fetches per-app limits configured for a specific device.
   */
  getAppLimits: async (deviceId: string) => {
    return await api.screenTime.appLimits(deviceId);
  },

  /**
   * Creates or updates screen-time policy for a device.
   */
  savePolicy: async (
    deviceId: string,
    body: {
      dailyLimitMinutes: number;
      enabled: boolean;
      bedtimeStart: string;
      bedtimeEnd: string;
      timezone: string;
    },
    hasExistingPolicy: boolean,
  ) => {
    return hasExistingPolicy
      ? await api.screenTime.update(deviceId, body)
      : await api.screenTime.create(deviceId, body);
  },

  /**
   * Adds an app-specific quota limit.
   */
  addAppLimit: async (
    deviceId: string,
    data: { appIdentifier: string; limitMinutes: number },
  ) => {
    return await api.screenTime.createAppLimit(deviceId, data);
  },

  /**
   * Deletes an app-specific quota limit.
   */
  removeAppLimit: async (deviceId: string, limitId: string) => {
    return await api.screenTime.deleteAppLimit(deviceId, limitId);
  },

  /**
   * Queues an immediate remote PAUSE command for the child device.
   */
  queuePauseCommand: async (deviceId: string) => {
    return await api.commands.create(deviceId, { commandType: "PAUSE" });
  },
};
