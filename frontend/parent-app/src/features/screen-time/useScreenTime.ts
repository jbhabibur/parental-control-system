/**
 * ============================================================================
 * Feature: Screen Time - Custom Hook
 * ============================================================================
 * Manages all screen time logic:
 * - Loading device options
 * - Fetching selected device's active policy & per-app limits
 * - Form state (daily limit, bedtime start/end, timezone, toggle)
 * - Persisting policies & managing per-app limits
 * - Queuing remote pause command
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../services/api";
import {
  AppLimit,
  DeviceOption,
  Policy,
  screenTimeService,
} from "./screen-time.service";

export function useScreenTime() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [limits, setLimits] = useState<AppLimit[]>([]);
  const [dailyLimit, setDailyLimit] = useState("120");
  const [bedtimeStart, setBedtimeStart] = useState("21:00");
  const [bedtimeEnd, setBedtimeEnd] = useState("07:00");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [enabled, setEnabled] = useState(true);
  const [appIdentifier, setAppIdentifier] = useState("");
  const [appLimitMinutes, setAppLimitMinutes] = useState("30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Initial Load: Fetch devices
  useEffect(() => {
    let active = true;
    screenTimeService
      .getDevices()
      .then((entries) => {
        if (!active) return;
        setDevices(entries);
        setDeviceId(entries[0]?.id || "");
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load devices.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // 2. Device Selection Effect: Fetch policy and limits
  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");

    Promise.allSettled([
      screenTimeService.getPolicy(deviceId),
      screenTimeService.getAppLimits(deviceId),
    ])
      .then(([policyResult, limitsResult]) => {
        if (!active) return;

        if (policyResult.status === "fulfilled") {
          const nextPolicy = policyResult.value.data as Policy;
          setPolicy(nextPolicy);
          setDailyLimit(String(nextPolicy.dailyLimitMinutes));
          setBedtimeStart(nextPolicy.bedtimeStart || "21:00");
          setBedtimeEnd(nextPolicy.bedtimeEnd || "07:00");
          setTimezone(nextPolicy.timezone || "Asia/Dhaka");
          setEnabled(nextPolicy.enabled);
        } else if (
          !(
            policyResult.reason instanceof ApiError &&
            policyResult.reason.status === 404
          )
        ) {
          setError(
            policyResult.reason instanceof ApiError
              ? policyResult.reason.message
              : "Unable to load policy.",
          );
        } else {
          setPolicy(null);
        }

        if (limitsResult.status === "fulfilled") {
          setLimits(
            Array.isArray(limitsResult.value.data)
              ? (limitsResult.value.data as AppLimit[])
              : [],
          );
        } else if (limitsResult.reason instanceof ApiError) {
          setError(limitsResult.reason.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  // 3. Action: Save Screen-Time Policy
  const savePolicy = async () => {
    const minutes = Number(dailyLimit);
    if (!deviceId || !Number.isInteger(minutes) || minutes < 1) {
      Alert.alert(
        "Invalid limit",
        "Choose a device and enter a positive whole number of minutes.",
      );
      return;
    }
    setSaving(true);
    try {
      const body = {
        dailyLimitMinutes: minutes,
        enabled,
        bedtimeStart,
        bedtimeEnd,
        timezone,
      };
      const result = await screenTimeService.savePolicy(
        deviceId,
        body,
        Boolean(policy),
      );
      setPolicy(result.data as Policy);
      Alert.alert("Saved", "Screen-time policy was saved.");
    } catch (requestError) {
      Alert.alert(
        "Could not save policy",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // 4. Action: Add Per-App Quota Limit
  const addAppLimit = async () => {
    const minutes = Number(appLimitMinutes);
    if (
      !deviceId ||
      !appIdentifier.trim() ||
      !Number.isInteger(minutes) ||
      minutes < 1
    ) {
      Alert.alert(
        "Invalid app limit",
        "Enter an app identifier and a positive whole number of minutes.",
      );
      return;
    }
    try {
      await screenTimeService.addAppLimit(deviceId, {
        appIdentifier: appIdentifier.trim(),
        limitMinutes: minutes,
      });
      setAppIdentifier("");
      const result = await screenTimeService.getAppLimits(deviceId);
      setLimits(Array.isArray(result.data) ? (result.data as AppLimit[]) : []);
    } catch (requestError) {
      Alert.alert(
        "Could not add app limit",
        requestError instanceof ApiError
          ? requestError.message
          : "Create a screen-time policy first.",
      );
    }
  };

  // 5. Action: Delete Per-App Limit
  const removeAppLimit = async (limitId: string) => {
    try {
      await screenTimeService.removeAppLimit(deviceId, limitId);
      setLimits((current) => current.filter((item) => item.id !== limitId));
    } catch (requestError) {
      Alert.alert(
        "Could not remove app limit",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  // 6. Action: Queue Remote Pause Command
  const pauseDevice = async () => {
    try {
      await screenTimeService.queuePauseCommand(deviceId);
      Alert.alert(
        "Command queued",
        "The child app must be online to receive this command.",
      );
    } catch (requestError) {
      Alert.alert(
        "Could not queue command",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  return {
    devices,
    deviceId,
    setDeviceId,
    policy,
    limits,
    dailyLimit,
    setDailyLimit,
    bedtimeStart,
    setBedtimeStart,
    bedtimeEnd,
    setBedtimeEnd,
    timezone,
    setTimezone,
    enabled,
    setEnabled,
    appIdentifier,
    setAppIdentifier,
    appLimitMinutes,
    setAppLimitMinutes,
    loading,
    saving,
    error,
    savePolicy,
    addAppLimit,
    removeAppLimit,
    pauseDevice,
  };
}
