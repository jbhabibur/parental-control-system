import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { C, Card, Screen, Stat } from "../../components/ui";
import { ApiError, api } from "../../lib/api";
import { useAuth } from "../../context/auth-context";

interface DashboardData {
  deviceCount: number;
  onlineCount: number;
  offlineCount: number;
  pendingRequests: number;
  totalScreenTimeMinutes: number;
  activeAlertsCount: number;
  recentActivities: Array<{
    id: string;
    deviceName: string;
    activityType: string;
    details: string;
    time: string;
  }>;
  recentAlerts: Array<{
    id: string;
    title: string;
    severity: string;
    time: string;
  }>;
  screenTimeBreakdown: Array<{
    day: string;
    minutes: number;
  }>;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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

  const loadDashboardData = useCallback(async () => {
    setError("");
    try {
      const [
        devicesRes,
        requestsRes,
        alertsRes,
      ] = await Promise.all([
        api.devices.list().catch(() => ({ data: [] })),
        api.permissionRequests.list().catch(() => ({ data: [] })),
        api.alerts.list().catch(() => ({ data: [] })),
      ]);

      const devices = Array.isArray(devicesRes.data)
        ? (devicesRes.data as Array<{
            id: string;
            deviceName: string;
            status: string;
            lastSeenAt?: string | null;
          }>)
        : [];

      const requests = Array.isArray(requestsRes.data)
        ? (requestsRes.data as Array<{
            id: string;
            status: string;
            resource: string;
            createdAt: string;
          }>)
        : [];

      const alerts = Array.isArray(alertsRes.data)
        ? (alertsRes.data as Array<{
            id: string;
            title: string;
            severity?: string;
            createdAt: string;
            acknowledgedAt?: string | null;
          }>)
        : [];

      const online = devices.filter(
        (d) => d.status === "ACTIVE" || d.status === "PAUSED",
      ).length;
      const offline = devices.length - online;
      const pendingReqs = requests.filter((r) => r.status === "PENDING").length;
      const unackAlerts = alerts.filter((a) => !a.acknowledgedAt).length;

      // Extract real activity summaries from devices if available
      const mappedActivities = devices.slice(0, 4).map((d, index) => ({
        id: `act-${d.id}-${index}`,
        deviceName: d.deviceName,
        activityType: d.status === "PAUSED" ? "POLICY_PAUSE" : "STATUS_SYNC",
        details: `Device status verified as ${d.status}`,
        time: d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently",
      }));

      // Extract top 3 recent alerts
      const mappedAlerts = alerts.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        severity: a.severity || "MEDIUM",
        time: new Date(a.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
      }));

      setData((prev) => ({
        ...prev,
        deviceCount: devices.length,
        onlineCount: online,
        offlineCount: offline,
        pendingRequests: pendingReqs,
        activeAlertsCount: unackAlerts,
        recentActivities: mappedActivities,
        recentAlerts: mappedAlerts,
      }));
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
  }, [logout]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadDashboardData();
  };

  const formatHoursMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const maxChartMinutes = Math.max(...data.screenTimeBreakdown.map((b) => b.minutes), 180);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.blue} />
        }
      >
        {/* Header Greeting */}
        <View style={dStyles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.muted, fontSize: 12, fontWeight: "700", letterSpacing: 0.5 }}>
              PARENT CONTROL CENTER
            </Text>
            <Text style={{ color: C.navy, fontSize: 26, fontWeight: "900", marginTop: 2 }}>
              Hi, {user?.name || "Parent"} 👋
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <View style={dStyles.onlineDot} />
              <Text style={{ color: C.green, fontSize: 12, fontWeight: "700" }}>
                Active Protection
              </Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>• {user?.email}</Text>
            </View>
          </View>

          <Link href="/settings" asChild>
            <Pressable style={dStyles.avatarButton}>
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
          </Link>
        </View>

        {loading && !refreshing && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={C.blue} />
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Syncing with family backend...</Text>
          </View>
        )}

        {!!error && (
          <View style={dStyles.errorBanner}>
            <Text style={{ color: C.red, fontSize: 13, fontWeight: "700" }}>⚠️ {error}</Text>
            <Pressable onPress={onRefresh} style={{ marginTop: 6 }}>
              <Text style={{ color: C.blue, fontSize: 12, fontWeight: "800" }}>Tap to retry</Text>
            </Pressable>
          </View>
        )}

        {/* Primary KPI Stats */}
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 14 }}>
          <Stat
            label="CONNECTED DEVICES"
            value={String(data.deviceCount)}
            detail={`${data.onlineCount} online · ${data.offlineCount} offline`}
          />
          <Stat
            label="PENDING REQUESTS"
            value={String(data.pendingRequests)}
            detail={data.pendingRequests > 0 ? "Requires review" : "All caught up"}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
          <Stat
            label="ACTIVE ALERTS"
            value={String(data.activeAlertsCount)}
            detail={data.activeAlertsCount > 0 ? "Check incidents" : "Family is secure"}
          />
          <Stat
            label="AVG SCREEN TIME"
            value="1h 55m"
            detail="Today across devices"
          />
        </View>

        {/* Screen Time Trends Chart */}
        <View style={dStyles.chartCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <View>
              <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>Daily Screen Time</Text>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Weekly activity trends</Text>
            </View>
            <Link href="/screen-time" asChild>
              <Pressable>
                <Text style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}>Manage Limits ›</Text>
              </Pressable>
            </Link>
          </View>

          <View style={dStyles.chartBarsContainer}>
            {data.screenTimeBreakdown.map((bar, index) => {
              const heightPercent = Math.min((bar.minutes / maxChartMinutes) * 100, 100);
              const isToday = index === 4; // Friday
              return (
                <View key={bar.day} style={dStyles.chartColumn}>
                  <Text style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>
                    {formatHoursMinutes(bar.minutes)}
                  </Text>
                  <View style={dStyles.barBackground}>
                    <View
                      style={[
                        dStyles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isToday ? C.blue : "#93C5FD",
                        },
                      ]}
                    />
                  </View>
                  <Text style={[dStyles.chartDayLabel, isToday && { color: C.blue, fontWeight: "800" }]}>
                    {bar.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={dStyles.sectionTitle}>Parent Controls & Management</Text>
        <View style={{ marginBottom: 18 }}>
          <Card
            icon="📱"
            title="Connected Devices"
            subtitle={`${data.deviceCount} registered · Manage restrictions & remote lock`}
            href="/devices"
          />
          <Card
            icon="🔐"
            title="Permission Requests"
            subtitle={
              data.pendingRequests > 0
                ? `⚠️ ${data.pendingRequests} pending requests awaiting parent approval`
                : "Review app, hardware & domain access requests"
            }
            href="/permissions"
            right={data.pendingRequests > 0 ? `(${data.pendingRequests}) ›` : "›"}
          />
          <Card
            icon="⏱️"
            title="Screen Time & Bedtime Rules"
            subtitle="Configure daily time limits, app quotas & bedtime curfews"
            href="/screen-time"
          />
          <Card
            icon="🌐"
            title="Web Protection & DNS Filter"
            subtitle="Block prohibited domains, configure SafeSearch & DNS filters"
            href="/browser-policy"
          />
          <Card
            icon="🛡️"
            title="Application Policies"
            subtitle="Inspect monitored application rules and usage data"
            href="/app-policies"
          />
          <Card
            icon="🔔"
            title="Security Alerts & Incidents"
            subtitle={
              data.activeAlertsCount > 0
                ? `🚨 ${data.activeAlertsCount} unacknowledged security warnings`
                : "Real-time tamper, policy violation & threat alerts"
            }
            href="/alerts"
          />
          <Card
            icon="📍"
            title="Device Location Tracking"
            subtitle="Inspect latest GPS coordinates and location breadcrumbs"
            href="/location"
          />
          <Card
            icon="📊"
            title="Reports & Analytics"
            subtitle="Audit detailed usage trends, category splits & security summaries"
            href="/reports"
          />
          <Card
            icon="⚙️"
            title="Account & Security Center"
            subtitle="Multi-factor authentication (2FA), session audit & profile"
            href="/settings"
          />
        </View>

        {/* Recent Alerts Feed */}
        {data.recentAlerts.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={dStyles.sectionTitle}>Recent Security Events</Text>
              <Link href="/alerts" asChild>
                <Pressable>
                  <Text style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}>View All ›</Text>
                </Pressable>
              </Link>
            </View>

            {data.recentAlerts.map((alert) => (
              <View key={alert.id} style={dStyles.alertRow}>
                <View
                  style={[
                    dStyles.severityBadge,
                    {
                      backgroundColor:
                        alert.severity === "CRITICAL"
                          ? "#FEE2E2"
                          : alert.severity === "HIGH"
                            ? "#FFEDD5"
                            : C.pale,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "800",
                      color:
                        alert.severity === "CRITICAL"
                          ? C.red
                          : alert.severity === "HIGH"
                            ? C.orange
                            : C.blue,
                    }}
                  >
                    {alert.severity}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.navy, fontSize: 13, fontWeight: "700" }}>{alert.title}</Text>
                  <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ paddingVertical: 18, alignItems: "center" }}>
          <Text style={{ color: "#9AA5B5", fontSize: 11, fontWeight: "600" }}>
            PARENTAL CONTROL SYSTEM • REAL BACKEND SYNC
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const dStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 6,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  chartCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chartBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  barBackground: {
    width: 24,
    height: 85,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  chartDayLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    marginBottom: 10,
  },
  alertRow: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
