/**
 * ============================================================================
 * Feature: Browser Policy - Custom Hook
 * ============================================================================
 * Manages:
 * 1. Device selection state
 * 2. DNS policy fetching & configuration (SafeSearch, DoH, DoT)
 * 3. Domain rules (ALLOW/BLOCK) additions and deletions
 * 4. Content categories lifecycle
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../services/api";
import {
  browserPolicyService,
  DnsPolicy,
  DomainCategory,
  DomainRule,
  DeviceOption,
} from "./browser-policy.service";

export function useBrowserPolicy() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policy, setPolicy] = useState<DnsPolicy | null>(null);
  const [rules, setRules] = useState<DomainRule[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [domain, setDomain] = useState("");
  const [action, setAction] = useState<"ALLOW" | "BLOCK">("BLOCK");
  const [categoryName, setCategoryName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [safeSearch, setSafeSearch] = useState(true);
  const [provider, setProvider] = useState("");
  const [dohEndpoint, setDohEndpoint] = useState("");
  const [dotEndpoint, setDotEndpoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const result = await browserPolicyService.getCategories();
      setCategories(
        Array.isArray(result.data) ? (result.data as DomainCategory[]) : [],
      );
    } catch {
      // ignore
    }
  };

  // 1. Initial Load: Fetch devices and categories
  useEffect(() => {
    let active = true;
    browserPolicyService
      .getInitialData()
      .then(([deviceResult, categoryResult]) => {
        if (!active) return;
        const entries = Array.isArray(deviceResult.data)
          ? (deviceResult.data as DeviceOption[])
          : [];
        setDevices(entries);
        setDeviceId(entries[0]?.id || "");
        setCategories(
          Array.isArray(categoryResult.data)
            ? (categoryResult.data as DomainCategory[])
            : [],
        );
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load policy data.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // 2. Device Selection Effect: Fetch DNS policy and domain rules
  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");

    browserPolicyService
      .getDevicePolicyAndRules(deviceId)
      .then(([policyResult, rulesResult]) => {
        if (!active) return;

        if (policyResult.status === "fulfilled") {
          const nextPolicy = policyResult.value.data as DnsPolicy;
          setPolicy(nextPolicy);
          setEnabled(nextPolicy.enabled);
          setSafeSearch(nextPolicy.safeSearch);
          setProvider(nextPolicy.provider || "");
          setDohEndpoint(nextPolicy.dohEndpoint || "");
          setDotEndpoint(nextPolicy.dotEndpoint || "");
        } else if (
          policyResult.reason instanceof ApiError &&
          policyResult.reason.status === 404
        ) {
          setPolicy(null);
        } else {
          setError(
            policyResult.reason instanceof ApiError
              ? policyResult.reason.message
              : "Unable to load DNS policy.",
          );
        }

        if (rulesResult.status === "fulfilled")
          setRules(
            Array.isArray(rulesResult.value.data)
              ? (rulesResult.value.data as DomainRule[])
              : [],
          );
        else if (
          !(
            rulesResult.reason instanceof ApiError &&
            rulesResult.reason.status === 404
          )
        )
          setError(
            rulesResult.reason instanceof ApiError
              ? rulesResult.reason.message
              : "Unable to load domain rules.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  // 3. Save DNS Policy
  const savePolicy = async () => {
    if (!deviceId) return;
    try {
      const body = {
        enabled,
        safeSearch,
        provider: provider.trim() || undefined,
        dohEndpoint: dohEndpoint.trim() || undefined,
        dotEndpoint: dotEndpoint.trim() || undefined,
      };
      const result = await browserPolicyService.savePolicy(
        deviceId,
        body,
        Boolean(policy),
      );
      setPolicy(result.data as DnsPolicy);
      Alert.alert(
        "Saved",
        "DNS policy was saved. Device enforcement depends on child-side policy sync.",
      );
    } catch (requestError) {
      Alert.alert(
        "Could not save DNS policy",
        requestError instanceof ApiError
          ? requestError.message
          : "Please check the endpoint values and try again.",
      );
    }
  };

  // 4. Add Domain Rule
  const addRule = async () => {
    const normalizedDomain = domain.trim().toLowerCase();
    if (!deviceId || !policy || !normalizedDomain.includes(".")) {
      Alert.alert(
        "Domain rule unavailable",
        "Create a DNS policy first, then enter a valid domain.",
      );
      return;
    }
    try {
      await browserPolicyService.createRule(deviceId, {
        domain: normalizedDomain,
        action,
      });
      setDomain("");
      const rulesResult = await browserPolicyService.getDevicePolicyAndRules(
        deviceId,
      );
      if (rulesResult[1].status === "fulfilled") {
        setRules(
          Array.isArray(rulesResult[1].value.data)
            ? (rulesResult[1].value.data as DomainRule[])
            : [],
        );
      }
    } catch (requestError) {
      Alert.alert(
        "Could not add domain rule",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  // 5. Delete Domain Rule
  const deleteRule = async (ruleId: string) => {
    try {
      await browserPolicyService.deleteRule(deviceId, ruleId);
      setRules((current) => current.filter((rule) => rule.id !== ruleId));
    } catch (requestError) {
      Alert.alert(
        "Could not delete rule",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  // 6. Category Management
  const addCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;
    try {
      await browserPolicyService.createCategory({
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      });
      setCategoryName("");
      await loadCategories();
    } catch (requestError) {
      Alert.alert(
        "Could not create category",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try another category name.",
      );
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await browserPolicyService.deleteCategory(categoryId);
      await loadCategories();
    } catch (requestError) {
      Alert.alert(
        "Could not delete category",
        requestError instanceof ApiError
          ? requestError.message
          : "A category may still be in use by a rule.",
      );
    }
  };

  return {
    devices,
    deviceId,
    setDeviceId,
    policy,
    rules,
    categories,
    domain,
    setDomain,
    action,
    setAction,
    categoryName,
    setCategoryName,
    enabled,
    setEnabled,
    safeSearch,
    setSafeSearch,
    provider,
    setProvider,
    dohEndpoint,
    setDohEndpoint,
    dotEndpoint,
    setDotEndpoint,
    loading,
    error,
    savePolicy,
    addRule,
    deleteRule,
    addCategory,
    deleteCategory,
  };
}
