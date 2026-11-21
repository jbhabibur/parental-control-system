/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - API Layer
 * ============================================================================
 * Centralizes all backend API calls for the Parent Safe Browser Dashboard.
 */

import { api } from "../../../services/api";
import type { BrowserSummaryPayload, DeviceOption } from "../types";

export const safeBrowserDashboardApi = {
  /**
   * Lists all child devices enrolled under the logged-in parent.
   */
  getDevices: async (): Promise<DeviceOption[]> => {
    const res = await api.devices.list();
    return Array.isArray(res.data) ? (res.data as DeviceOption[]) : [];
  },

  /**
   * Fetches full Safe Browser summary for a child device:
   * DNS policy, domain rules, history, pending domain requests, and stats.
   */
  getBrowserSummary: async (
    deviceId: string,
  ): Promise<BrowserSummaryPayload> => {
    const res = await api.browserSummary(deviceId);
    return res.data as BrowserSummaryPayload;
  },

  /**
   * Approves a child's DOMAIN_ACCESS request (auto-creates ALLOW DNS rule).
   */
  approveDomainRequest: async (requestId: string) => {
    return api.permissionRequests.approve(requestId);
  },

  /**
   * Denies a child's DOMAIN_ACCESS request (auto-creates BLOCK DNS rule).
   */
  denyDomainRequest: async (requestId: string) => {
    return api.permissionRequests.reject(requestId);
  },

  /**
   * Adds or updates a domain rule (ALLOW or BLOCK) for a device.
   */
  setDomainRule: async (
    deviceId: string,
    domain: string,
    action: "ALLOW" | "BLOCK",
  ) => {
    return api.dns.createRule(deviceId, { domain, action });
  },

  /**
   * Updates an existing rule's action between ALLOW and BLOCK.
   */
  updateDomainRule: async (
    deviceId: string,
    ruleId: string,
    action: "ALLOW" | "BLOCK",
  ) => {
    return api.dns.updateRule(deviceId, ruleId, { action });
  },

  /**
   * Deletes a domain rule completely.
   */
  deleteDomainRule: async (deviceId: string, ruleId: string) => {
    return api.dns.deleteRule(deviceId, ruleId);
  },

  /**
   * Creates or updates the device's DNS-level protection configuration (DoH/DoT/SafeSearch).
   */
  saveDnsPolicy: async (
    deviceId: string,
    payload: {
      enabled: boolean;
      safeSearch: boolean;
      provider?: string | null;
      dohEndpoint?: string | null;
      dotEndpoint?: string | null;
    },
    hasExistingPolicy: boolean,
  ) => {
    return hasExistingPolicy
      ? api.dns.update(deviceId, payload)
      : api.dns.create(deviceId, payload);
  },
};
