/**
 * ============================================================================
 * Feature: Reports - Custom Hook
 * ============================================================================
 * Manages:
 * 1. Device selection filter
 * 2. Time range selector (Today, Week, Month)
 * 3. Analytics metrics calculation and pull-to-refresh
 */

import { useEffect, useState } from "react";
import { ApiError } from "../../services/api";
import {
  DeviceOption,
  ReportStats,
  reportsService,
} from "./reports.service";

export function useReports() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [timeRange, setTimeRange] = useState<"TODAY" | "WEEK" | "MONTH">("WEEK");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState<ReportStats>({
    totalScreenMinutes: 140,
    appsMonitored: 0,
    alertsRecorded: 0,
    requestsProcessed: 0,
    blockedDomainsCount: 0,
  });

  const loadReportData = async () => {
    setError("");
    try {
      const data = await reportsService.getAnalyticsData(selectedDeviceId);
      setDevices(data.devices);
      if (data.devices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(data.devices[0].id);
      }
      setStats(data.stats);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to generate analytics reports.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadReportData();
  }, [selectedDeviceId]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadReportData();
  };

  // Sample weekly distribution (hours)
  const weeklyData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.2 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 2.5 },
    { day: "Fri", hours: 3.1 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 1.9 },
  ];

  const maxHours = 3.5;

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    timeRange,
    setTimeRange,
    loading,
    refreshing,
    error,
    stats,
    weeklyData,
    maxHours,
    onRefresh,
  };
}
