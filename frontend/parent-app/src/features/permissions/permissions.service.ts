/**
 * ============================================================================
 * Feature: Permissions - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Fetching permission requests initiated by child devices
 * 2. Approving or rejecting specific requests
 * 3. Fetching hardware permissions for a device
 * 4. Updating hardware policy settings (Camera, Mic, GPS, Storage)
 */

import { api } from "../../services/api";

export interface PermissionRequest {
  id: string;
  childId: string;
  deviceId: string;
  requestType:
    | "HARDWARE_PERMISSION"
    | "APPLICATION_ACCESS"
    | "DOMAIN_ACCESS"
    | string;
  resource: string;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED" | string;
  createdAt: string;
}

export interface HardwarePermission {
  id: string;
  deviceId: string;
  permissionType:
    | "CAMERA"
    | "MICROPHONE"
    | "LOCATION"
    | "STORAGE"
    | "CONTACTS"
    | "NOTIFICATIONS"
    | "OTHER"
    | string;
  allowed: boolean;
  updatedAt?: string;
}

export interface DeviceOption {
  id: string;
  deviceName: string;
  platform: string;
}

export const permissionsService = {
  /**
   * Fetches all child access requests.
   */
  getRequests: async () => {
    return await api.permissionRequests.list();
  },

  /**
   * Approves a child permission request.
   */
  approveRequest: async (requestId: string) => {
    return await api.permissionRequests.approve(requestId);
  },

  /**
   * Rejects a child permission request.
   */
  rejectRequest: async (requestId: string) => {
    return await api.permissionRequests.reject(requestId);
  },

  /**
   * Fetches devices list.
   */
  getDevices: async () => {
    return await api.devices.list();
  },

  /**
   * Fetches hardware permissions for a device.
   */
  getDevicePermissions: async (deviceId: string) => {
    return await api.devices.permissions(deviceId);
  },

  /**
   * Updates an individual hardware permission rule.
   */
  updateDevicePermission: async (
    deviceId: string,
    permissionId: string,
    allowed: boolean,
  ) => {
    return await api.devices.updatePermission(deviceId, permissionId, allowed);
  },
};
