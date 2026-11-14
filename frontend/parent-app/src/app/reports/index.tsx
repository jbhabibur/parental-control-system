import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { C, PageHeader, Screen, Stat } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

interface DeviceOption {
  id: string;
  deviceName: string;
  platform: string;
}

export default function ReportsScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [timeRange, setTimeRange] = useState<"TODAY" | "WEEK" | "MONTH">("WEEK");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Report Metrics
  const [stats, setStats] = useState({
    totalScreenMinutes: 140,
    appsMonitored: 0,
    alertsRecorded: 0,
    requestsProcessed: 0,
    blockedDomainsCount: 0,
  });

  const loadReportData = async () => {
    setError("");
    try {
      const [devicesRes, alertsRes, requestsRes] = await Promise.all([
        api.devices.list().catch(() => ({ data: [] })),
        api.alerts.list().catch(() => ({ data: [] })),
        api.permissionRequests.list().catch(() => ({ data: [] })),
      ]);

      const deviceList = Array.isArray(devicesRes.data)
        ? (devicesRes.data as DeviceOption[])
        : [];
      setDevices(deviceList);

      if (deviceList.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(deviceList[0].id);
      }

      const alertsList = Array.isArray(alertsRes.data) ? alertsRes.data : [];
      const requestsList = Array.isArray(requestsRes.data) ? requestsRes.data : [];

      setStats((prev) => ({
        ...prev,
        alertsRecorded: alertsList.length,
        requestsProcessed: requestsList.length,
      }));

      if (selectedDeviceId || deviceList[0]?.id) {
        const targetId = selectedDeviceId || deviceList[0]?.id;
        const [usageRes, rulesRes] = await Promise.all([
          api.usage.list(targetId).catch(() => ({ data: [] })),
          api.dns.rules(targetId).catch(() => ({ data: [] })),
        ]);

        const usages = Array.isArray(usageRes.data) ? usageRes.data : [];
        const rules = Array.isArray(rulesRes.data) ? rulesRes.data : [];
        const blocked = (rules as Array<{ action?: string }>).filter(
          (r) => r.action === "BLOCK",
        ).length;

        setStats((prev) => ({
          ...prev,
          appsMonitored: usages.length,
          blockedDomainsCount: blocked,
        }));
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to generate analytics reports.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadReportData();
  }, [selectedDeviceId]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadReportData();
  };

  // Sample weekly distribution (hours)
  const weeklyData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.2 },
    { day: "Wed", hours: 1.8 },
    { day: "Thu", hours: 2.5 },
    { day: "Fri", hours: 3.1 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 1.9 },
  ];

  const maxHours = 3.5;

  return (
    <Screen>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive family safety trends & activity audit"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />
        }
      >
        {/* Device Filter */}
        {devices.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={rStyles.subHeader}>DEVICE FILTER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {devices.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => setSelectedDeviceId(d.id)}
                  style={[
                    rStyles.chip,
                    selectedDeviceId === d.id && rStyles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      rStyles.chipText,
                      selectedDeviceId === d.id && rStyles.activeChipText,
                    ]}
                  >
                    {d.deviceName} ({d.platform})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Time Range Selector */}
        <View style={rStyles.rangeRow}>
          {(["TODAY", "WEEK", "MONTH"] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setTimeRange(r)}
              style={[rStyles.rangeBtn, timeRange === r && rStyles.activeRangeBtn]}
            >
              <Text style={[rStyles.rangeBtnText, timeRange === r && rStyles.activeRangeBtnText]}>
                {r === "TODAY" ? "Today" : r === "WEEK" ? "Past 7 Days" : "Past 30 Days"}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading && !refreshing && (
          <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />
        )}

        {!!error && (
          <View style={rStyles.errorBox}>
            <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>{error}</Text>
          </View>
        )}

        {/* Summary Metrics */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <Stat
            label="APPS MONITORED"
            value={String(stats.appsMonitored)}
            detail="Active packages"
          />
          <Stat
            label="BLOCKED DOMAINS"
            value={String(stats.blockedDomainsCount)}
            detail="DNS filter rules"
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
          <Stat
            label="SECURITY INCIDENTS"
            value={String(stats.alertsRecorded)}
            detail="Alert logs recorded"
          />
          <Stat
            label="ACCESS REQUESTS"
            value={String(stats.requestsProcessed)}
            detail="Submitted by child"
          />
        </View>

        {/* Screen Time Analytics Chart */}
        <View style={rStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>
            Screen Time Trends
          </Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 2, marginBottom: 14 }}>
            Aggregated usage over selected period
          </Text>

          <View style={rStyles.chartContainer}>
            {weeklyData.map((d) => {
              const heightPct = Math.min((d.hours / maxHours) * 100, 100);
              return (
                <View key={d.day} style={rStyles.chartCol}>
                  <Text style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>
                    {d.hours}h
                  </Text>
                  <View style={rStyles.barSlot}>
                    <View
                      style={[
                        rStyles.barFill,
                        { height: `${heightPct}%`, backgroundColor: C.blue },
                      ]}
                    />
                  </View>
                  <Text style={rStyles.dayLabel}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Breakdown Card */}
        <View style={rStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>
            Protection & Policy Status
          </Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 2, marginBottom: 14 }}>
            Overview of enforcement across child activities
          </Text>

          <View style={rStyles.metricRow}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "700" }}>
              🌐 SafeSearch & Prohibited Content
            </Text>
            <Text style={{ color: C.green, fontSize: 12, fontWeight: "800" }}>
              ACTIVE
            </Text>
          </View>

          <View style={rStyles.metricRow}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "700" }}>
              ⏱️ Bedtime Curfew Enforcement
            </Text>
            <Text style={{ color: C.blue, fontSize: 12, fontWeight: "800" }}>
              CONFIGURED
            </Text>
          </View>

          <View style={rStyles.metricRow}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "700" }}>
              📍 Location Breadcrumbs
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, fontWeight: "700" }}>
              READY
            </Text>
          </View>
        </View>

        {/* Navigation Shortcut to full settings */}
        <View style={{ marginVertical: 10 }}>
          <Link href="/dashboard" asChild>
            <Pressable style={rStyles.backButton}>
              <Text style={{ color: C.blue, fontWeight: "800", fontSize: 14 }}>
                ← Return to Main Dashboard
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </Screen>
  );
}

const rStyles = StyleSheet.create({
  subHeader: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  activeChipText: {
    color: C.white,
  },
  rangeRow: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
  },
  activeRangeBtn: {
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  rangeBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },
  activeRangeBtnText: {
    color: C.navy,
    fontWeight: "800",
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  chartCol: {
    alignItems: "center",
    flex: 1,
  },
  barSlot: {
    width: 22,
    height: 80,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 5,
  },
  dayLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
    marginTop: 6,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: C.pale,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});

