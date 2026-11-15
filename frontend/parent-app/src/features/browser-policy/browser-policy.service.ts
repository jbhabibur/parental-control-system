/**
 * ============================================================================
 * Feature: Browser Policy & DNS Filtering - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Fetching enrolled child devices
 * 2. Fetching, saving, and updating DNS policies (DoH/DoT endpoints, SafeSearch)
 * 3. Domain filtering rules (Allow / Block specific URLs/domains)
 * 4. Content categories management
 */

import { api } from "../../services/api";

export type DeviceOption = { id: string; deviceName: string };

export type DomainRule = {
  id: string;
  domain: string;
  action: "ALLOW" | "BLOCK";
  categoryId?: string | null;
};

export type DomainCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type DnsPolicy = {
  id?: string;
  enabled: boolean;
  provider?: string | null;
  dohEndpoint?: string | null;
  dotEndpoint?: string | null;
  safeSearch: boolean;
};

export const browserPolicyService = {
  /**
   * Loads devices and category catalogs in parallel.
   */
  getInitialData: async () => {
    return await Promise.all([api.devices.list(), api.categories.list()]);
  },

  /**
   * Fetches DNS policy and domain rules for a given device.
   */
  getDevicePolicyAndRules: async (deviceId: string) => {
    return await Promise.allSettled([
      api.dns.get(deviceId),
      api.dns.rules(deviceId),
    ]);
  },

  /**
   * Saves or updates a DNS policy configuration.
   */
  savePolicy: async (
    deviceId: string,
    body: {
      enabled: boolean;
      safeSearch: boolean;
      provider?: string;
      dohEndpoint?: string;
      dotEndpoint?: string;
    },
    hasExistingPolicy: boolean,
  ) => {
    return hasExistingPolicy
      ? await api.dns.update(deviceId, body)
      : await api.dns.create(deviceId, body);
  },

  /**
   * Creates a new domain rule (ALLOW or BLOCK).
   */
  createRule: async (
    deviceId: string,
    rule: { domain: string; action: "ALLOW" | "BLOCK" },
  ) => {
    return await api.dns.createRule(deviceId, rule);
  },

  /**
   * Deletes a domain rule.
   */
  deleteRule: async (deviceId: string, ruleId: string) => {
    return await api.dns.deleteRule(deviceId, ruleId);
  },

  /**
   * Lists categories.
   */
  getCategories: async () => {
    return await api.categories.list();
  },

  /**
   * Creates a new domain category.
   */
  createCategory: async (category: { name: string; slug: string }) => {
    return await api.categories.create(category);
  },

  /**
   * Deletes a category.
   */
  deleteCategory: async (categoryId: string) => {
    return await api.categories.delete(categoryId);
  },
};
