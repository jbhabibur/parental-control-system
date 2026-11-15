/**
 * ============================================================================
 * Feature: Activity - Custom Hook
 * ============================================================================
 * Fetches and formats real-time activity metrics:
 * 1. App usage durations
 * 2. Device foreground and system events
 * 3. Visited URLs and blocked DNS queries
 */

import { useEffect, useState } from "react";
import { ApiError } from "../../services/api";
import { ActivityRow, activityService } from "./activity.service";

export function useActivity() {
  const [deviceName, setDeviceName] = useState("");
  const [usage, setUsage] = useState<ActivityRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [history, setHistory] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const deviceResult = await activityService.getDevices();
        const devices = Array.isArray(deviceResult.data)
          ? (deviceResult.data as Array<{ id: string; deviceName: string }>)
          : [];
        const selected = devices[0];
        if (!selected) {
          if (active) setDeviceName("");
          return;
        }

        const [usageResult, activityResult, historyResult] =
          await activityService.getDeviceActivityData(selected.id);

        if (!active) return;
        setDeviceName(selected.deviceName);
        setUsage(
          Array.isArray(usageResult.data)
            ? (usageResult.data as ActivityRow[])
            : [],
        );
        setActivities(
          Array.isArray(activityResult.data)
            ? (activityResult.data as ActivityRow[])
            : [],
        );
        setHistory(
          Array.isArray(historyResult.data)
            ? (historyResult.data as ActivityRow[])
            : [],
        );
      } catch (requestError) {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load activity.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (value: unknown) =>
    typeof value === "string"
      ? new Date(value).toLocaleString()
      : "Time unavailable";

  const formatDuration = (value: unknown) => {
    const seconds = typeof value === "number" ? value : 0;
    return `${Math.floor(seconds / 60)} min`;
  };

  return {
    deviceName,
    usage,
    activities,
    history,
    loading,
    error,
    formatDate,
    formatDuration,
  };
}
