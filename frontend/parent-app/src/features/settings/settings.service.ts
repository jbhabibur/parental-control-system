/**
 * ============================================================================
 * Feature: Settings - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Backend health status checking
 * 2. Stored preferences (Push notifications, Biometric app lock, Dark mode)
 */

import { api, getStored, setStored } from "../../services/api";

export const settingsService = {
  /**
   * Fetches health check from backend.
   */
  getHealth: async () => {
    return await api.health();
  },

  /**
   * Loads user preferences from secure storage.
   */
  loadPreferences: async () => {
    const [healthRes, bioPref, pushPref, darkPref] = await Promise.all([
      api.health().catch(() => ({ status: "Unreachable" })),
      getStored("parent-control.pref.biometric"),
      getStored("parent-control.pref.push"),
      getStored("parent-control.pref.dark"),
    ]);

    return {
      healthStatus: String(healthRes.status || "Healthy"),
      bioEnabled: bioPref === "true",
      pushEnabled: pushPref !== "false",
      darkMode: darkPref === "true",
    };
  },

  /**
   * Updates a preference flag in secure storage.
   */
  savePreference: async (key: string, value: boolean) => {
    await setStored(key, value ? "true" : "false");
  },
};
