/**
 * ============================================================================
 * Feature: Home (Dashboard) - Custom Hook
 * ============================================================================
 * Encapsulates all dashboard state management, lifecycle effects,
 * pull-to-refresh logic, and helper formatters.
 */

import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { ApiError } from "../../services/api";
import { useAuth } from "../../context/auth-context";
import { DashboardData, homeService } from "./home.service";

export function useHome() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<DashboardData>({
    deviceCount: 0,
    onlineCount: 0,
    offlineCount: 0,
    pendingRequests: 0,
    totalScreenTimeMinutes: 0,
    activeAlertsCount: 0,
    recentActivities: [],
    recentAlerts: [],
    screenTimeBreakdown: [
      { day: "Mon", minutes: 75 },
      { day: "Tue", minutes: 110 },
      { day: "Wed", minutes: 90 },
      { day: "Thu", minutes: 125 },
      { day: "Fri", minutes: 160 },
      { day: "Sat", minutes: 140 },
      { day: "Sun", minutes: 95 },
    ],
  });

  /**
   * Fetches the latest summary metrics from the backend.
   */
  const loadDashboardData = useCallback(async () => {
    setError("");
    try {
      const summary = await homeService.fetchDashboardSummary();
      setData((prev) => ({
        ...prev,
        ...summary,
      }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        await logout();
        router.replace("/auth/login");
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to sync dashboard with backend. Pull down to refresh.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Handles user pull-to-refresh action.
   */
  const onRefresh = () => {
    setRefreshing(true);
    void loadDashboardData();
  };

  /**
   * Formats raw minutes into a user-friendly string (e.g. 125 -> "2h 5m").
   */
  const formatHoursMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const maxChartMinutes = Math.max(
    ...data.screenTimeBreakdown.map((b) => b.minutes),
    180,
  );

  return {
    user,
    data,
    loading,
    refreshing,
    error,
    onRefresh,
    formatHoursMinutes,
    maxChartMinutes,
  };
}
