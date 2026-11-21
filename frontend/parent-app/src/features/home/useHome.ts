/**
 * ============================================================================
 * Feature: Home (Dashboard) - Custom Hook
 * ============================================================================
 * Encapsulates all dashboard state management:
 * 1. Summary metrics (devices, pending requests, alerts, screen time chart)
 * 2. Daily Child Screen Time Limit & App Usage setting (hours, minutes, presets)
 * 3. App-specific limit quotas
 * 4. Device selection & synchronization
 */

import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { ApiError } from "../../services/api";
import { useAuth } from "../../context/auth-context";
import {
  DashboardData,
  DeviceItem,
  ScreenTimePolicyData,
  homeService,
} from "./home.service";

export function useHome() {
  const { user, logout } = useAuth();

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Devices & Selected Device
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // Screen Time Policy state for selected device
  const [currentPolicy, setCurrentPolicy] = useState<ScreenTimePolicyData | null>(null);
  const [limitHours, setLimitHours] = useState(2);
  const [limitMinutes, setLimitMinutes] = useState(0);
  const [limitEnabled, setLimitEnabled] = useState(true);
  const [isSavingLimit, setIsSavingLimit] = useState(false);
  const [policyMessage, setPolicyMessage] = useState("");

  // App-specific limit states
  const [showAppLimitSection, setShowAppLimitSection] = useState(false);
  const [appIdentifier, setAppIdentifier] = useState("");
  const [appLimitMinutes, setAppLimitMinutes] = useState("30");
  const [isSavingAppLimit, setIsSavingAppLimit] = useState(false);

  // Overall dashboard statistics
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
      const { summary, rawDevices } = await homeService.fetchDashboardSummary();
      setData((prev) => ({
        ...prev,
        ...summary,
      }));
      setDevices(rawDevices);

      // Auto-select first device if none selected yet
      if (rawDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(rawDevices[0].id);
      }
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
  }, [logout, selectedDeviceId]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Loads policy for the currently selected device.
   */
  const loadPolicyForDevice = useCallback(async (deviceId: string) => {
    if (!deviceId) return;
    try {
      const policy = await homeService.fetchDevicePolicy(deviceId);
      setCurrentPolicy(policy);
      if (policy && policy.dailyLimitMinutes) {
        const total = policy.dailyLimitMinutes;
        setLimitHours(Math.floor(total / 60));
        setLimitMinutes(total % 60);
        setLimitEnabled(policy.enabled);
      } else {
        // Default 2 hours if no policy established yet
        setLimitHours(2);
        setLimitMinutes(0);
        setLimitEnabled(true);
      }
    } catch {
      // Ignore policy read errors (e.g. 404 when no policy is set yet)
      setCurrentPolicy(null);
    }
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      void loadPolicyForDevice(selectedDeviceId);
    }
  }, [selectedDeviceId, loadPolicyForDevice]);

  /**
   * Handles user pull-to-refresh action.
   */
  const onRefresh = () => {
    setRefreshing(true);
    void loadDashboardData();
    if (selectedDeviceId) {
      void loadPolicyForDevice(selectedDeviceId);
    }
  };

  /**
   * Saves the daily phone usage limit for the child device.
   */
  const saveDailyLimit = async (customHours?: number, customMinutes?: number) => {
    if (!selectedDeviceId) {
      Alert.alert(
        "No Device Selected",
        "Please connect or select a child device first.",
      );
      return;
    }

    const h = customHours !== undefined ? customHours : limitHours;
    const m = customMinutes !== undefined ? customMinutes : limitMinutes;
    const totalMinutes = h * 60 + m;

    if (totalMinutes <= 0) {
      Alert.alert(
        "Invalid Limit",
        "Please set at least 1 minute of daily screen time.",
      );
      return;
    }

    setIsSavingLimit(true);
    setPolicyMessage("");
    try {
      await homeService.saveDailyLimit(
        selectedDeviceId,
        totalMinutes,
        limitEnabled,
        Boolean(currentPolicy?.id || currentPolicy),
      );
      setLimitHours(h);
      setLimitMinutes(m);
      setPolicyMessage(`Daily limit saved: ${h}h ${m}m per day`);
      Alert.alert(
        "Daily Limit Updated! 🎉",
        `Your child's device is now configured for a maximum of ${h} hr ${m} min of daily usage.`,
      );
      void loadPolicyForDevice(selectedDeviceId);
    } catch (err) {
      Alert.alert(
        "Could Not Save Daily Limit",
        err instanceof ApiError ? err.message : "Please try again.",
      );
    } finally {
      setIsSavingLimit(false);
    }
  };

  /**
   * Quick Preset selector (e.g. 1h, 2h, etc.)
   */
  const applyPreset = async (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    setLimitHours(h);
    setLimitMinutes(m);
    await saveDailyLimit(h, m);
  };

  /**
   * Stepper adjustments for Hours and Minutes
   */
  const adjustHours = (delta: number) => {
    setLimitHours((prev) => Math.max(0, Math.min(12, prev + delta)));
  };

  const adjustMinutes = (delta: number) => {
    setLimitMinutes((prev) => {
      let next = prev + delta;
      if (next >= 60) next = 0;
      if (next < 0) next = 45;
      return next;
    });
  };

  /**
   * Saves an app-specific quota limit.
   */
  const saveAppQuota = async () => {
    if (!selectedDeviceId) {
      Alert.alert("No Device", "Please select a child device first.");
      return;
    }
    const mins = Number(appLimitMinutes);
    if (!appIdentifier.trim() || !Number.isInteger(mins) || mins < 1) {
      Alert.alert(
        "Invalid App Quota",
        "Enter an app name/identifier and positive number of minutes.",
      );
      return;
    }

    setIsSavingAppLimit(true);
    try {
      await homeService.createAppLimit(selectedDeviceId, appIdentifier, mins);
      Alert.alert(
        "App Quota Established! ⏱️",
        `${appIdentifier} is now limited to ${mins} minutes per day.`,
      );
      setAppIdentifier("");
      setShowAppLimitSection(false);
    } catch (err) {
      Alert.alert(
        "Could Not Add App Limit",
        err instanceof ApiError
          ? err.message
          : "Please ensure a daily screen time policy is active first.",
      );
    } finally {
      setIsSavingAppLimit(false);
    }
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

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  return {
    user,
    data,
    loading,
    refreshing,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    selectedDevice,
    currentPolicy,
    limitHours,
    limitMinutes,
    limitEnabled,
    setLimitEnabled,
    isSavingLimit,
    policyMessage,
    saveDailyLimit,
    applyPreset,
    adjustHours,
    adjustMinutes,
    showAppLimitSection,
    setShowAppLimitSection,
    appIdentifier,
    setAppIdentifier,
    appLimitMinutes,
    setAppLimitMinutes,
    isSavingAppLimit,
    saveAppQuota,
    onRefresh,
    formatHoursMinutes,
    maxChartMinutes,
  };
}
