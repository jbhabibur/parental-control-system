import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

interface PermissionRequest {
  id: string;
  childId: string;
  deviceId: string;
  requestType: "HARDWARE_PERMISSION" | "APPLICATION_ACCESS" | "DOMAIN_ACCESS" | string;
  resource: string;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED" | string;
  createdAt: string;
}

interface HardwarePermission {
  id: string;
  deviceId: string;
  permissionType: "CAMERA" | "MICROPHONE" | "LOCATION" | "STORAGE" | "CONTACTS" | "NOTIFICATIONS" | "OTHER" | string;
  allowed: boolean;
  updatedAt?: string;
}

interface DeviceOption {
  id: string;
  deviceName: string;
  platform: string;
}

export default function PermissionsScreen() {
  const [activeTab, setActiveTab] = useState<"requests" | "policies">("requests");

  // Requests state
  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "DENIED">("ALL");
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
      const result = await api.permissionRequests.list();
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
      const result = await api.devices.list();
      const entries = Array.isArray(result.data) ? (result.data as DeviceOption[]) : [];
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
      const result = await api.devices.permissions(deviceId);
      setDevicePermissions(
        Array.isArray(result.data) ? (result.data as HardwarePermission[]) : [],
      );
    } catch (err) {
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

  const handleDecision = async (
    item: PermissionRequest,
    decision: "approve" | "reject",
  ) => {
    setBusyRequestId(item.id);
    try {
      if (decision === "approve") {
        await api.permissionRequests.approve(item.id);
        Alert.alert("Approved", `Granted access to ${item.resource}.`);
      } else {
        await api.permissionRequests.reject(item.id);
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

  const toggleHardwarePermission = async (perm: HardwarePermission) => {
    const nextAllowed = !perm.allowed;
    setBusyPermissionId(perm.id);

    // Optimistic UI update
    setDevicePermissions((prev) =>
      prev.map((p) => (p.id === perm.id ? { ...p, allowed: nextAllowed } : p)),
    );

    try {
      await api.devices.updatePermission(selectedDeviceId, perm.id, nextAllowed);
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: "#FEF3C7", text: C.orange, label: "PENDING REVIEW" };
      case "APPROVED":
        return { bg: "#DCFCE7", text: C.green, label: "APPROVED" };
      case "DENIED":
        return { bg: "#FEE2E2", text: C.red, label: "DENIED" };
      default:
        return { bg: "#F1F5F9", text: C.muted, label: status };
    }
  };

  const getPermissionIcon = (type: string) => {
    switch (type) {
      case "CAMERA":
        return "📷";
      case "MICROPHONE":
        return "🎙️";
      case "LOCATION":
        return "📍";
      case "STORAGE":
        return "💾";
      case "CONTACTS":
        return "👥";
      case "NOTIFICATIONS":
        return "🔔";
      default:
        return "🛡️";
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Permissions & Access"
        subtitle="Review child requests and manage device hardware policies"
      />

      {/* Tabs */}
      <View style={pStyles.tabBar}>
        <Pressable
          onPress={() => setActiveTab("requests")}
          style={[pStyles.tabButton, activeTab === "requests" && pStyles.activeTabButton]}
        >
          <Text
            style={[
              pStyles.tabButtonText,
              activeTab === "requests" && pStyles.activeTabButtonText,
            ]}
          >
            Permission Requests {pendingCount > 0 ? `(${pendingCount})` : ""}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("policies")}
          style={[pStyles.tabButton, activeTab === "policies" && pStyles.activeTabButton]}
        >
          <Text
            style={[
              pStyles.tabButtonText,
              activeTab === "policies" && pStyles.activeTabButtonText,
            ]}
          >
            Hardware Rules
          </Text>
        </Pressable>
      </View>

      {/* TAB 1: PERMISSION REQUESTS */}
      {activeTab === "requests" && (
        <View>
          {/* Status Filters */}
          <View style={pStyles.filterRow}>
            {(["ALL", "PENDING", "APPROVED", "DENIED"] as const).map((status) => (
              <Pressable
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[
                  pStyles.filterChip,
                  filterStatus === status && pStyles.activeFilterChip,
                ]}
              >
                <Text
                  style={[
                    pStyles.filterChipText,
                    filterStatus === status && pStyles.activeFilterChipText,
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>

          {loadingRequests && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

          {!loadingRequests && filteredRequests.length === 0 && (
            <View style={pStyles.emptyCard}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
              <Text style={{ color: C.navy, fontWeight: "800", fontSize: 15 }}>
                No {filterStatus !== "ALL" ? filterStatus.toLowerCase() : ""} requests found
              </Text>
              <Text style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 4 }}>
                When your child requests hardware, app, or website access on their companion device, it will appear here.
              </Text>
            </View>
          )}

          {filteredRequests.map((item) => {
            const badge = getStatusStyle(item.status);
            const isBusy = busyRequestId === item.id;

            return (
              <View key={item.id} style={pStyles.requestCard}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: C.navy, fontWeight: "900", fontSize: 15 }}>
                      {item.resource}
                    </Text>
                    <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                      Type: {item.requestType.replace(/_/g, " ")}
                    </Text>
                    {!!item.reason && (
                      <Text style={{ color: "#475569", fontSize: 12, fontStyle: "italic", marginTop: 4 }}>
                        "{item.reason}"
                      </Text>
                    )}
                    <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                      Requested: {new Date(item.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>

                  <View style={[pStyles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={{ color: badge.text, fontSize: 10, fontWeight: "800" }}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {item.status === "PENDING" && (
                  <View style={pStyles.actionRow}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={isBusy}
                      onPress={() => void handleDecision(item, "approve")}
                      style={[pStyles.actionBtn, { backgroundColor: C.pale }]}
                    >
                      <Text style={{ color: C.blue, fontWeight: "800", fontSize: 13 }}>
                        {isBusy ? "Processing..." : "✓ Approve"}
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      disabled={isBusy}
                      onPress={() => void handleDecision(item, "reject")}
                      style={[pStyles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                    >
                      <Text style={{ color: C.red, fontWeight: "800", fontSize: 13 }}>
                        {isBusy ? "Processing..." : "✕ Deny"}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* TAB 2: DEVICE HARDWARE RULES */}
      {activeTab === "policies" && (
        <View>
          {devices.length === 0 ? (
            <View style={pStyles.emptyCard}>
              <Text style={{ color: C.muted }}>No connected devices found to configure.</Text>
            </View>
          ) : (
            <>
              {/* Device Selector */}
              <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>
                SELECT CHILD DEVICE
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {devices.map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() => setSelectedDeviceId(d.id)}
                    style={[
                      pStyles.deviceChip,
                      selectedDeviceId === d.id && pStyles.activeDeviceChip,
                    ]}
                  >
                    <Text
                      style={[
                        pStyles.deviceChipText,
                        selectedDeviceId === d.id && pStyles.activeDeviceChipText,
                      ]}
                    >
                      {d.deviceName} ({d.platform})
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={pStyles.infoNotice}>
                <Text style={{ color: C.blue, fontWeight: "800", fontSize: 12 }}>
                  ℹ️ Operating System Policy Notice
                </Text>
                <Text style={{ color: "#475569", fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                  Toggling permissions applies parent safety policy on the backend. Restrictions are enforced by the child companion application using native Android / iOS capabilities.
                </Text>
              </View>

              {loadingPolicies && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

              {!loadingPolicies && devicePermissions.length === 0 && (
                <View style={pStyles.emptyCard}>
                  <Text style={{ color: C.muted, fontSize: 13 }}>
                    No hardware permission entries registered for this device yet. Permissions synchronize when the child companion app boots.
                  </Text>
                </View>
              )}

              {devicePermissions.map((perm) => (
                <View key={perm.id} style={pStyles.permRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                    <Text style={{ fontSize: 24 }}>{getPermissionIcon(perm.permissionType)}</Text>
                    <View>
                      <Text style={{ color: C.navy, fontSize: 15, fontWeight: "800" }}>
                        {perm.permissionType}
                      </Text>
                      <Text style={{ color: perm.allowed ? C.green : C.red, fontSize: 12, fontWeight: "700" }}>
                        {perm.allowed ? "Allowed by Parent" : "Restricted by Parent"}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={perm.allowed}
                    disabled={busyPermissionId === perm.id}
                    onValueChange={() => void toggleHardwarePermission(perm)}
                    trackColor={{ false: "#CBD5E1", true: C.blue }}
                    thumbColor={C.white}
                  />
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </Screen>
  );
}

const pStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  activeTabButtonText: {
    color: C.navy,
    fontWeight: "900",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  activeFilterChip: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
  },
  activeFilterChipText: {
    color: C.white,
  },
  requestCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  activeDeviceChip: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  deviceChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  activeDeviceChipText: {
    color: C.white,
  },
  infoNotice: {
    backgroundColor: C.pale,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 16,
  },
  permRow: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
});
