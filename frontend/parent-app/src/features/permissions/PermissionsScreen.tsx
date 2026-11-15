/**
 * ============================================================================
 * Feature: Permissions - UI Component
 * ============================================================================
 * Visual presentation for Permission Requests & Device Hardware Policies.
 * Displays:
 * 1. Top tabs: Permission Requests vs. Hardware Rules
 * 2. Status filters (ALL, PENDING, APPROVED, DENIED)
 * 3. Pending requests review cards with 1-tap Approve & Deny buttons
 * 4. Device selector chips for Hardware Rules
 * 5. Toggles for Camera, Microphone, GPS Location, Storage, etc.
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { usePermissions } from "./usePermissions";
import { permissionsStyles } from "./permissions.styles";
import { PermissionRequest, HardwarePermission } from "./permissions.service";

export function PermissionsScreen() {
  const {
    activeTab,
    setActiveTab,
    requests,
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
    handleDecision,
    toggleHardwarePermission,
  } = usePermissions();

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

      {!!error && (
        <Text style={{ color: C.red, marginBottom: 12 }}>{error}</Text>
      )}

      {/* Tabs */}
      <View style={permissionsStyles.tabBar}>
        <Pressable
          onPress={() => setActiveTab("requests")}
          style={[
            permissionsStyles.tabButton,
            activeTab === "requests" && permissionsStyles.activeTabButton,
          ]}
        >
          <Text
            style={[
              permissionsStyles.tabButtonText,
              activeTab === "requests" && permissionsStyles.activeTabButtonText,
            ]}
          >
            Permission Requests {pendingCount > 0 ? `(${pendingCount})` : ""}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("policies")}
          style={[
            permissionsStyles.tabButton,
            activeTab === "policies" && permissionsStyles.activeTabButton,
          ]}
        >
          <Text
            style={[
              permissionsStyles.tabButtonText,
              activeTab === "policies" && permissionsStyles.activeTabButtonText,
            ]}
          >
            Hardware Rules
          </Text>
        </Pressable>
      </View>

      {/* ==================================================================== */}
      {/* TAB 1: PERMISSION REQUESTS */}
      {/* ==================================================================== */}
      {activeTab === "requests" && (
        <View>
          {/* Status Filters */}
          <View style={permissionsStyles.filterRow}>
            {(["ALL", "PENDING", "APPROVED", "DENIED"] as const).map(
              (status) => (
                <Pressable
                  key={status}
                  onPress={() => setFilterStatus(status)}
                  style={[
                    permissionsStyles.filterChip,
                    filterStatus === status &&
                      permissionsStyles.activeFilterChip,
                  ]}
                >
                  <Text
                    style={[
                      permissionsStyles.filterChipText,
                      filterStatus === status &&
                        permissionsStyles.activeFilterChipText,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ),
            )}
          </View>

          {loadingRequests && (
            <ActivityIndicator
              color={C.blue}
              style={{ marginVertical: 20 }}
            />
          )}

          {!loadingRequests && requests.length === 0 && (
            <View style={permissionsStyles.emptyCard}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
              <Text
                style={{ color: C.navy, fontWeight: "800", fontSize: 15 }}
              >
                No {filterStatus !== "ALL" ? filterStatus.toLowerCase() : ""}{" "}
                requests found
              </Text>
              <Text
                style={{
                  color: C.muted,
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                When your child requests hardware, app, or website access on their companion device, it will appear here.
              </Text>
            </View>
          )}

          {requests.map((item: PermissionRequest) => {
            const badge = getStatusStyle(item.status);
            const isBusy = busyRequestId === item.id;

            return (
              <View key={item.id} style={permissionsStyles.requestCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      style={{
                        color: C.navy,
                        fontWeight: "900",
                        fontSize: 15,
                      }}
                    >
                      {item.resource}
                    </Text>
                    <Text
                      style={{ color: C.muted, fontSize: 12, marginTop: 2 }}
                    >
                      Type: {item.requestType.replace(/_/g, " ")}
                    </Text>
                    {!!item.reason && (
                      <Text
                        style={{
                          color: "#475569",
                          fontSize: 12,
                          fontStyle: "italic",
                          marginTop: 4,
                        }}
                      >
                        "{item.reason}"
                      </Text>
                    )}
                    <Text
                      style={{ color: C.muted, fontSize: 11, marginTop: 4 }}
                    >
                      Requested:{" "}
                      {new Date(item.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  <View
                    style={[
                      permissionsStyles.statusBadge,
                      { backgroundColor: badge.bg },
                    ]}
                  >
                    <Text
                      style={{
                        color: badge.text,
                        fontSize: 10,
                        fontWeight: "800",
                      }}
                    >
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {item.status === "PENDING" && (
                  <View style={permissionsStyles.actionRow}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={isBusy}
                      onPress={() => void handleDecision(item, "approve")}
                      style={[
                        permissionsStyles.actionBtn,
                        { backgroundColor: C.pale },
                      ]}
                    >
                      <Text
                        style={{
                          color: C.blue,
                          fontWeight: "800",
                          fontSize: 13,
                        }}
                      >
                        {isBusy ? "Processing..." : "✓ Approve"}
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      disabled={isBusy}
                      onPress={() => void handleDecision(item, "reject")}
                      style={[
                        permissionsStyles.actionBtn,
                        { backgroundColor: "#FEE2E2" },
                      ]}
                    >
                      <Text
                        style={{
                          color: C.red,
                          fontWeight: "800",
                          fontSize: 13,
                        }}
                      >
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

      {/* ==================================================================== */}
      {/* TAB 2: DEVICE HARDWARE RULES */}
      {/* ==================================================================== */}
      {activeTab === "policies" && (
        <View>
          {devices.length === 0 ? (
            <View style={permissionsStyles.emptyCard}>
              <Text style={{ color: C.muted }}>
                No connected devices found to configure.
              </Text>
            </View>
          ) : (
            <>
              {/* Device Selector */}
              <Text
                style={{
                  color: C.navy,
                  fontSize: 13,
                  fontWeight: "800",
                  marginBottom: 8,
                }}
              >
                SELECT CHILD DEVICE
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                {devices.map((d) => {
                  const isSelected = selectedDeviceId === d.id;
                  return (
                    <Pressable
                      key={d.id}
                      onPress={() => setSelectedDeviceId(d.id)}
                      style={[
                        permissionsStyles.deviceChip,
                        isSelected && permissionsStyles.activeDeviceChip,
                      ]}
                    >
                      <Text
                        style={[
                          permissionsStyles.deviceChipText,
                          isSelected &&
                            permissionsStyles.activeDeviceChipText,
                        ]}
                      >
                        {d.deviceName} ({d.platform})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={permissionsStyles.infoNotice}>
                <Text
                  style={{ color: C.blue, fontWeight: "800", fontSize: 12 }}
                >
                  ℹ️ Operating System Policy Notice
                </Text>
                <Text
                  style={{
                    color: "#475569",
                    fontSize: 11,
                    lineHeight: 16,
                    marginTop: 4,
                  }}
                >
                  Toggling permissions applies parent safety policy on the backend. Restrictions are enforced by the child companion application using native Android / iOS capabilities.
                </Text>
              </View>

              {loadingPolicies && (
                <ActivityIndicator
                  color={C.blue}
                  style={{ marginVertical: 20 }}
                />
              )}

              {!loadingPolicies && devicePermissions.length === 0 && (
                <View style={permissionsStyles.emptyCard}>
                  <Text style={{ color: C.muted, fontSize: 13 }}>
                    No hardware permission entries registered for this device yet. Permissions synchronize when the child companion app boots.
                  </Text>
                </View>
              )}

              {devicePermissions.map((perm: HardwarePermission) => (
                <View key={perm.id} style={permissionsStyles.permRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>
                      {getPermissionIcon(perm.permissionType)}
                    </Text>
                    <View>
                      <Text
                        style={{
                          color: C.navy,
                          fontSize: 15,
                          fontWeight: "800",
                        }}
                      >
                        {perm.permissionType}
                      </Text>
                      <Text
                        style={{
                          color: perm.allowed ? C.green : C.red,
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        {perm.allowed
                          ? "Allowed by Parent"
                          : "Restricted by Parent"}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={perm.allowed}
                    disabled={busyPermissionId === perm.id}
                    onValueChange={() =>
                      void toggleHardwarePermission(perm)
                    }
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

export default PermissionsScreen;
