/**
 * ============================================================================
 * Feature: Alerts - Custom Hook
 * ============================================================================
 * Manages:
 * 1. Alerts fetching & error handling
 * 2. Acknowledging alerts and refreshing state
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../services/api";
import { AlertItem, alertsService } from "./alerts.service";

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    setError("");
    try {
      const result = await alertsService.getAlerts();
      setAlerts(Array.isArray(result.data) ? (result.data as AlertItem[]) : []);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load alerts.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAlerts();
  }, []);

  const acknowledge = async (alertId: string) => {
    setBusyId(alertId);
    try {
      await alertsService.acknowledgeAlert(alertId);
      await loadAlerts();
    } catch (requestError) {
      Alert.alert(
        "Could not acknowledge alert",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setBusyId("");
    }
  };

  return {
    alerts,
    loading,
    busyId,
    error,
    acknowledge,
  };
}
