/**
 * @file useAppPolicies.ts
 * @description State management hook for the App Policies feature.
 *
 * Responsibilities:
 *  1. Load connected devices on mount; auto-select the first one.
 *  2. Load the policy list and usage log whenever `deviceId` changes.
 *  3. Expose `removePolicy` to delete a rule after a confirmation Alert.
 *  4. Expose `selectDevice` so the UI can switch between child devices.
 *  5. Expose `loading`, `busyPolicyId`, and `error` for feedback rendering.
 */

import { Alert } from "react-native";
import { useEffect, useState } from "react";
import {
  AppPolicy,
  AppUsageEntry,
  DeviceOption,
  appPoliciesService,
} from "./app-policies.service";

// ─── Hook Return Shape ───────────────────────────────────────────────────────

export type UseAppPoliciesReturn = {
  /** All connected child devices. */
  devices: DeviceOption[];
  /** The currently selected device ID. */
  deviceId: string;
  /** Enforced application-policy rules for the selected device. */
  policies: AppPolicy[];
  /** App-usage log entries for the selected device. */
  usageList: AppUsageEntry[];
  /** True while loading devices or policies/usage. */
  loading: boolean;
  /** The policy ID currently being deleted (empty = none). */
  busyPolicyId: string;
  /** Non-empty string when a request fails; empty on success. */
  error: string;
  /** Select a different child device. */
  selectDevice: (id: string) => void;
  /** Prompt to confirm, then delete a policy rule. */
  removePolicy: (policyId: string, appName: string) => void;
};

// ─── Hook Implementation ─────────────────────────────────────────────────────

/**
 * `useAppPolicies` — encapsulates all state and side-effects for the
 * App Policies screen. The screen component only calls this hook and
 * renders the returned data.
 */
export function useAppPolicies(): UseAppPoliciesReturn {
  // ── State ────────────────────────────────────────────────────────────────
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policies, setPolicies] = useState<AppPolicy[]>([]);
  const [usageList, setUsageList] = useState<AppUsageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPolicyId, setBusyPolicyId] = useState("");
  const [error, setError] = useState("");

  // ── Effect 1: Load devices on mount ─────────────────────────────────────
  useEffect(() => {
    let active = true;

    void appPoliciesService
      .listDevices()
      .then((entries) => {
        if (!active) return;
        setDevices(entries);
        setDeviceId(entries[0]?.id ?? "");
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            appPoliciesService.parseError(
              err,
              "Unable to load connected devices.",
            ),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ── Effect 2: Load policies + usage when deviceId changes ────────────────
  useEffect(() => {
    if (!deviceId) return;

    let active = true;
    setLoading(true);
    setError("");

    void Promise.all([
      appPoliciesService.listPolicies(deviceId),
      appPoliciesService.listUsage(deviceId),
    ])
      .then(([policiesData, usageData]) => {
        if (!active) return;
        setPolicies(policiesData);
        setUsageList(usageData);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            appPoliciesService.parseError(
              err,
              "Unable to load application policies.",
            ),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  // ── Action: Select device ─────────────────────────────────────────────────

  /** Update the selected device; Effect 2 reacts to the state change. */
  const selectDevice = (id: string) => setDeviceId(id);

  // ── Action: Remove policy ─────────────────────────────────────────────────

  /**
   * Shows a confirmation Alert; on "Delete" calls the service to delete
   * the rule, then optimistically removes it from local state.
   */
  const removePolicy = (policyId: string, appName: string) => {
    Alert.alert(
      "Remove Policy",
      `Are you sure you want to delete the policy for ${appName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setBusyPolicyId(policyId);
            try {
              await appPoliciesService.deletePolicy(deviceId, policyId);
              // Optimistically remove the deleted rule from local state
              setPolicies((current) =>
                current.filter((p) => p.id !== policyId),
              );
              Alert.alert("Policy Deleted", `Removed policy for ${appName}.`);
            } catch (err: unknown) {
              Alert.alert(
                "Could Not Remove Policy",
                appPoliciesService.parseError(err, "Please try again."),
              );
            } finally {
              setBusyPolicyId("");
            }
          },
        },
      ],
    );
  };

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    devices,
    deviceId,
    policies,
    usageList,
    loading,
    busyPolicyId,
    error,
    selectDevice,
    removePolicy,
  };
}
