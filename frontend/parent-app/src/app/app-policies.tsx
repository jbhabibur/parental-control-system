import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../components/ui";
import { ApiError, api } from "../lib/api";

type DeviceOption = { id: string; deviceName: string; platform: string };

type AppPolicy = {
  id: string;
  appIdentifier: string;
  appName?: string | null;
  decision: "ALLOW" | "BLOCK" | string;
  category?: string | null;
  createdAt?: string;
};

type AppUsageEntry = {
  id: string;
  appIdentifier: string;
  appName?: string | null;
  durationMinutes: number;
  lastUsedAt?: string | null;
};

export default function AppPoliciesScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policies, setPolicies] = useState<AppPolicy[]>([]);
  const [usageList, setUsageList] = useState<AppUsageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPolicyId, setBusyPolicyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void api.devices
      .list()
      .then((result) => {
        const entries = Array.isArray(result.data)
          ? (result.data as DeviceOption[])
          : [];
        if (!active) return;
        setDevices(entries);
        setDeviceId(entries[0]?.id || "");
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load connected devices.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");

    void Promise.all([
      api.appPolicies.list(deviceId).catch(() => ({ data: [] })),
      api.usage.list(deviceId).catch(() => ({ data: [] })),
    ])
      .then(([policiesRes, usageRes]) => {
        if (!active) return;
        setPolicies(
          Array.isArray(policiesRes.data)
            ? (policiesRes.data as AppPolicy[])
            : [],
        );
        setUsageList(
          Array.isArray(usageRes.data)
            ? (usageRes.data as AppUsageEntry[])
            : [],
        );
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load application policies.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

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
              await api.appPolicies.delete(deviceId, policyId);
              setPolicies((current) =>
                current.filter((policy) => policy.id !== policyId),
              );
              Alert.alert("Policy Deleted", `Removed policy for ${appName}.`);
            } catch (requestError) {
              Alert.alert(
                "Could Not Remove Policy",
                requestError instanceof ApiError
                  ? requestError.message
                  : "Please try again.",
              );
            } finally {
              setBusyPolicyId("");
            }
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <PageHeader
        title="Application Rules"
        subtitle="Manage allowed and blocked apps and monitor usage"
      />

      {/* Device Selector Chips */}
      {devices.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>
            SELECT DEVICE
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {devices.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setDeviceId(item.id)}
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

      {loading && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>{error}</Text>
        </View>
      )}

      {/* Active Policies Section */}
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

      {/* Reported App Usage Breakdown */}
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

      {/* Platform & Backend Constraint Notice */}
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

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.navy,
    marginBottom: 10,
  },
  policyCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  decisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  policyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  usageRow: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noticeCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 8,
    marginBottom: 24,
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    alignItems: "center",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});
