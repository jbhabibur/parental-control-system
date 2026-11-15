/**
 * ============================================================================
 * Feature: Devices - Service Layer
 * ============================================================================
 * Handles API calls for:
 * 1. Fetching connected child devices
 * 2. Generating temporary 6-digit pairing invitation codes
 * 3. Toggling device status (ACTIVE / PAUSED)
 * 4. Queuing remote commands (LOCK, UNLOCK, RESUME, SYNC_POLICY)
 * 5. Soft-removing / unlinking devices
 */

import { api } from "../../services/api";

export interface DeviceItem {
  id: string;
  childId: string;
  deviceIdentifier: string;
  deviceName: string;
  platform: "ANDROID" | "IOS" | string;
  osVersion?: string | null;
  appVersion?: string | null;
  status: "ACTIVE" | "OFFLINE" | "LOCKED" | "PAUSED" | string;
  lastSeenAt?: string | null;
  createdAt: string;
}

export const devicesService = {
  /**
   * Fetches all registered devices associated with the parent's children.
   */
  getDevices: async (): Promise<DeviceItem[]> => {
    const result = await api.devices.list();
    return Array.isArray(result.data) ? (result.data as DeviceItem[]) : [];
  },

  /**
   * Generates a 6-digit device pairing code valid for 15 minutes.
   */
  generatePairingCode: async (childId: string) => {
    return await api.pairing.generate(childId);
  },

  /**
   * Updates device status between ACTIVE and PAUSED.
   */
  updateStatus: async (deviceId: string, status: string) => {
    return await api.devices.setStatus(deviceId, status);
  },

  /**
   * Sends an administrative remote command to the child companion app.
   */
  sendCommand: async (
    deviceId: string,
    commandType: "LOCK" | "UNLOCK" | "PAUSE" | "RESUME" | "SYNC_POLICY",
  ) => {
    return await api.commands.create(deviceId, { commandType });
  },

  /**
   * Removes / unlinks a device from parental supervision.
   */
  removeDevice: async (deviceId: string) => {
    return await api.devices.remove(deviceId);
  },
};
