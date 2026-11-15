/**
 * ============================================================================
 * Feature: Permissions - Custom Hook
 * ============================================================================
 * Manages:
 * 1. Active tab selection ("requests" vs "policies")
 * 2. Permission requests fetching, filtering, and decision submission (approve/reject)
 * 3. Hardware devices list and selected device permissions loading
 * 4. Optimistic toggling for individual hardware permissions
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../services/api";
import {
  DeviceOption,
  HardwarePermission,
  PermissionRequest,
  permissionsService,
} from "./permissions.service";

export function usePermissions() {
  const [activeTab, setActiveTab] = useState<"requests" | "policies">("requests");

  // Requests state
  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "DENIED"
  >("ALL");
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState("");

  // Device policies state
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [devicePermissions, setDevicePermissions] = useState<HardwarePermission[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [busyPermissionId, setBusyPermissionId] = useState("");

  const [error, setError] = useState("");

  // Load permission requests
  const loadRequests = async () => {
    setError("");
    try {
      const result = await permissionsService.getRequests();
      setRequests(
        Array.isArray(result.data) ? (result.data as PermissionRequest[]) : [],
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load permission requests.",
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  // Load devices for hardware policies tab
  const loadDevices = async () => {
    try {
      const result = await permissionsService.getDevices();
      const entries = Array.isArray(result.data)
        ? (result.data as DeviceOption[])
        : [];
      setDevices(entries);
      if (entries.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(entries[0].id);
      }
    } catch {
      // Ignored
    }
  };

  // Load hardware permissions for selected device
  const loadDevicePermissions = async (deviceId: string) => {
    if (!deviceId) return;
    setLoadingPolicies(true);
    try {
      const result = await permissionsService.getDevicePermissions(deviceId);
      setDevicePermissions(
        Array.isArray(result.data)
          ? (result.data as HardwarePermission[])
          : [],
      );
    } catch {
      // Handled in UI
    } finally {
      setLoadingPolicies(false);
    }
  };

  useEffect(() => {
    void loadRequests();
    void loadDevices();
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      void loadDevicePermissions(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  // Handle Approve or Reject
  const handleDecision = async (
    item: PermissionRequest,
    decision: "approve" | "reject",
  ) => {
    setBusyRequestId(item.id);
    try {
      if (decision === "approve") {
        await permissionsService.approveRequest(item.id);
        Alert.alert("Approved", `Granted access to ${item.resource}.`);
      } else {
        await permissionsService.rejectRequest(item.id);
        Alert.alert("Denied", `Rejected access to ${item.resource}.`);
      }
      await loadRequests();
    } catch (requestError) {
      Alert.alert(
        "Update Failed",
        requestError instanceof ApiError
          ? requestError.message
          : "Could not record decision.",
      );
    } finally {
      setBusyRequestId("");
    }
  };

  // Toggle hardware permission with optimistic update
  const toggleHardwarePermission = async (perm: HardwarePermission) => {
    const nextAllowed = !perm.allowed;
    setBusyPermissionId(perm.id);

    // Optimistic UI update
    setDevicePermissions((prev) =>
      prev.map((p) => (p.id === perm.id ? { ...p, allowed: nextAllowed } : p)),
    );

    try {
      await permissionsService.updateDevicePermission(
        selectedDeviceId,
        perm.id,
        nextAllowed,
      );
    } catch (err) {
      // Revert on failure
      setDevicePermissions((prev) =>
        prev.map((p) => (p.id === perm.id ? { ...p, allowed: !nextAllowed } : p)),
      );
      Alert.alert(
        "Update Failed",
        err instanceof ApiError ? err.message : "Unable to modify permission.",
      );
    } finally {
      setBusyPermissionId("");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return {
    activeTab,
    setActiveTab,
    requests: filteredRequests,
    filterStatus,
    setFilterStatus,
    loadingRequests,
    busyRequestId,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    devicePermissions,
    loadingPolicies,
    busyPermissionId,
    error,
    pendingCount,
    loadRequests,
    handleDecision,
    toggleHardwarePermission,
  };
}
