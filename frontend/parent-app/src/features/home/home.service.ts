/**
 * ============================================================================
 * Feature: Home (Dashboard) - Service Layer
 * ============================================================================
 * Handles all backend API data fetching and transformations for the dashboard.
 * - Queries devices list
 * - Queries pending permission requests
 * - Queries active security alerts
 * Aggregates these into a single DashboardData object.
 */

import { api } from "../../services/api";

export interface DashboardData {
  deviceCount: number;
  onlineCount: number;
  offlineCount: number;
  pendingRequests: number;
  totalScreenTimeMinutes: number;
  activeAlertsCount: number;
  recentActivities: Array<{
    id: string;
    deviceName: string;
    activityType: string;
    details: string;
    time: string;
  }>;
  recentAlerts: Array<{
    id: string;
    title: string;
    severity: string;
    time: string;
  }>;
  screenTimeBreakdown: Array<{
    day: string;
    minutes: number;
  }>;
}

export const homeService = {
  /**
   * Fetches real-time dashboard data from the backend APIs concurrently.
   */
  fetchDashboardSummary: async (): Promise<Partial<DashboardData>> => {
    // 1. Fetch devices, permission requests, and security alerts in parallel
    const [devicesRes, requestsRes, alertsRes] = await Promise.all([
      api.devices.list().catch(() => ({ data: [] })),
      api.permissionRequests.list().catch(() => ({ data: [] })),
      api.alerts.list().catch(() => ({ data: [] })),
    ]);

    // 2. Normalize and parse response datasets
    const devices = Array.isArray(devicesRes.data)
      ? (devicesRes.data as Array<{
          id: string;
          deviceName: string;
          status: string;
          lastSeenAt?: string | null;
        }>)
      : [];

    const requests = Array.isArray(requestsRes.data)
      ? (requestsRes.data as Array<{
          id: string;
          status: string;
          resource: string;
          createdAt: string;
        }>)
      : [];

    const alerts = Array.isArray(alertsRes.data)
      ? (alertsRes.data as Array<{
          id: string;
          title: string;
          severity?: string;
          createdAt: string;
          acknowledgedAt?: string | null;
        }>)
      : [];

    // 3. Calculate statistics
    const online = devices.filter(
      (d) => d.status === "ACTIVE" || d.status === "PAUSED",
    ).length;
    const offline = devices.length - online;
    const pendingReqs = requests.filter((r) => r.status === "PENDING").length;
    const unackAlerts = alerts.filter((a) => !a.acknowledgedAt).length;

    // 4. Map recent activities from devices
    const mappedActivities = devices.slice(0, 4).map((d, index) => ({
      id: `act-${d.id}-${index}`,
      deviceName: d.deviceName,
      activityType: d.status === "PAUSED" ? "POLICY_PAUSE" : "STATUS_SYNC",
      details: `Device status verified as ${d.status}`,
      time: d.lastSeenAt
        ? new Date(d.lastSeenAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Recently",
    }));

    // 5. Map top recent alerts
    const mappedAlerts = alerts.slice(0, 3).map((a) => ({
      id: a.id,
      title: a.title,
      severity: a.severity || "MEDIUM",
      time: new Date(a.createdAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
    }));

    return {
      deviceCount: devices.length,
      onlineCount: online,
      offlineCount: offline,
      pendingRequests: pendingReqs,
      activeAlertsCount: unackAlerts,
      recentActivities: mappedActivities,
      recentAlerts: mappedAlerts,
    };
  },
};
