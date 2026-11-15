/**
 * ============================================================================
 * Feature: Alerts - Service Layer
 * ============================================================================
 * Handles API operations for:
 * 1. Fetching security, geofence, and tampering alerts
 * 2. Acknowledging alerts
 */

import { api } from "../../services/api";

export interface AlertItem {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  severity?: string;
  createdAt: string;
  acknowledgedAt?: string | null;
}

export const alertsService = {
  /**
   * Fetches active security alerts.
   */
  getAlerts: async () => {
    return await api.alerts.list();
  },

  /**
   * Marks an alert as reviewed / acknowledged.
   */
  acknowledgeAlert: async (alertId: string) => {
    return await api.alerts.acknowledge(alertId);
  },
};
