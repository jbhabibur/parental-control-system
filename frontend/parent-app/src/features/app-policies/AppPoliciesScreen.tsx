/**
 * @file AppPoliciesScreen.tsx
 * @description UI Component for the App Policies feature.
 *
 * Responsibilities:
 *  1. Header section with title and description.
 *  2. Horizontal device selector chips.
 *  3. Display active enforced application policies (with BLOCKED/ALLOWED status).
 *  4. Delete action for individual application rules.
 *  5. Display reported app usage breakdown (app identifier, duration).
 *  6. Platform and policy enforcement notice.
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { appPoliciesStyles as styles } from "./app-policies.styles";
import { useAppPolicies } from "./useAppPolicies";

export function AppPoliciesScreen() {
  const {
    devices,
    deviceId,
    policies,
    usageList,
    loading,
    busyPolicyId,
    error,
    selectDevice,
    removePolicy,
  } = useAppPolicies();

  return (
    <Screen>
      {/* ==================================================================== */}
      {/* 1. Header Section                                                    */}
      {/* ==================================================================== */}
      <PageHeader
        title="Application Rules"
        subtitle="Manage allowed and blocked apps and monitor usage"
      />

      {/* ==================================================================== */}
      {/* 2. Device Selector Chips                                             */}
      {/* ==================================================================== */}
      {devices.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>
            SELECT DEVICE
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {devices.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => selectDevice(item.id)}
                style={[
                  styles.deviceChip,
                  item.id === deviceId && styles.activeDeviceChip,
                ]}
              >
                <Text
                  style={[
                    styles.deviceChipText,
                    item.id === deviceId && styles.activeDeviceChipText,
                  ]}
                >
                  {item.deviceName} ({item.platform})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ==================================================================== */}
      {/* 3. Loading & Error States                                            */}
      {/* ==================================================================== */}
      {loading && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>{error}</Text>
        </View>
      )}

      {/* ==================================================================== */}
      {/* 4. Active Policies Section                                           */}
      {/* ==================================================================== */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>
          Enforced Application Policies ({policies.length})
        </Text>

        {!loading && policies.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🛡️</Text>
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 14 }}>
              No Application Policies
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 4 }}>
              No specific app restrictions have been established for this device.
            </Text>
          </View>
        )}

        {policies.map((policy) => {
          const isBlocked = policy.decision === "BLOCK";
          const isBusy = busyPolicyId === policy.id;
          const displayName = policy.appName || policy.appIdentifier;

          return (
            <View key={policy.id} style={styles.policyCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: C.navy, fontWeight: "900", fontSize: 15 }}>
                    {displayName}
                  </Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                    Package: {policy.appIdentifier}
                    {policy.category ? ` • ${policy.category}` : ""}
                  </Text>
                </View>

                <View
                  style={[
                    styles.decisionBadge,
                    { backgroundColor: isBlocked ? "#FEE2E2" : "#DCFCE7" },
                  ]}
                >
                  <Text
                    style={{
                      color: isBlocked ? C.red : C.green,
                      fontWeight: "900",
                      fontSize: 11,
                    }}
                  >
                    {isBlocked ? "BLOCKED" : "ALLOWED"}
                  </Text>
                </View>
              </View>

              <View style={styles.policyActions}>
                <Text style={{ color: C.muted, fontSize: 11 }}>
                  Enforced on Device
                </Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={isBusy}
                  onPress={() => removePolicy(policy.id, displayName)}
                >
                  <Text style={{ color: C.red, fontWeight: "800", fontSize: 12 }}>
                    {isBusy ? "Deleting..." : "Delete Rule"}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* ==================================================================== */}
      {/* 5. Reported App Usage Breakdown                                      */}
      {/* ==================================================================== */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>
          Reported App Activity ({usageList.length})
        </Text>

        {!loading && usageList.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={{ color: C.muted, fontSize: 12 }}>
              No app usage logs reported by this device yet.
            </Text>
          </View>
        )}

        {usageList.map((usage) => (
          <View key={usage.id} style={styles.usageRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.navy, fontWeight: "800", fontSize: 14 }}>
                {usage.appName || usage.appIdentifier}
              </Text>
              <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                {usage.appIdentifier}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: C.blue, fontWeight: "900", fontSize: 14 }}>
                {usage.durationMinutes} mins
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>
                Reported
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ==================================================================== */}
      {/* 6. Platform & Backend Constraint Notice                              */}
      {/* ==================================================================== */}
      <View style={styles.noticeCard}>
        <Text style={{ color: C.navy, fontWeight: "800", fontSize: 12 }}>
          ℹ️ Platform & Policy Enforcement Notice
        </Text>
        <Text style={{ color: "#475569", fontSize: 11, lineHeight: 16, marginTop: 4 }}>
          Application policies configure backend rules. On Android, the companion app utilizes UsageStats and Accessibility services to intercept blocked apps. On iOS, restrictions operate within Sandbox limitations.
        </Text>
      </View>
    </Screen>
  );
}

export default AppPoliciesScreen;
