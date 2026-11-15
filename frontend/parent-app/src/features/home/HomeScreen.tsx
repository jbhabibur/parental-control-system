/**
 * ============================================================================
 * Feature: Home (Dashboard) - UI Component
 * ============================================================================
 * Visual presentation for the parent dashboard screen.
 * Displays:
 * 1. Administrator header & status indicators
 * 2. KPI metrics (Connected devices, requests, alerts, screen time)
 * 3. Weekly screen time trend chart
 * 4. Quick navigation cards to all parental management features
 * 5. Recent security events feed
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { C, Card, Screen, Stat } from "../../components/ui";
import { useHome } from "./useHome";
import { homeStyles } from "./home.styles";

export function HomeScreen() {
  const {
    user,
    data,
    loading,
    refreshing,
    error,
    onRefresh,
    formatHoursMinutes,
    maxChartMinutes,
  } = useHome();

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.blue}
          />
        }
      >
        {/* ==================================================================== */}
        {/* 1. Header Row & User Greeting */}
        {/* ==================================================================== */}
        <View style={homeStyles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: C.muted,
                fontSize: 12,
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            >
              PARENT CONTROL DASHBOARD
            </Text>
            <Text
              style={{
                color: C.navy,
                fontSize: 26,
                fontWeight: "900",
                marginTop: 2,
              }}
            >
              Hi, {user?.name || "Parent"} 👋
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
              }}
            >
              <View style={homeStyles.onlineDot} />
              <Text style={{ color: C.green, fontSize: 12, fontWeight: "700" }}>
                Active Protection
              </Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>
                • {user?.email}
              </Text>
            </View>
          </View>

          <Link href="/settings" asChild>
            <Pressable style={homeStyles.avatarButton}>
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
          </Link>
        </View>

        {/* Loading Indicator */}
        {loading && !refreshing && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={C.blue} />
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              Syncing with family backend...
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {!!error && (
          <View style={homeStyles.errorBanner}>
            <Text style={{ color: C.red, fontSize: 13, fontWeight: "700" }}>
              ⚠️ {error}
            </Text>
            <Pressable onPress={onRefresh} style={{ marginTop: 6 }}>
              <Text style={{ color: C.blue, fontSize: 12, fontWeight: "800" }}>
                Tap to retry
              </Text>
            </Pressable>
          </View>
        )}

        {/* ==================================================================== */}
        {/* 2. Primary KPI Stats */}
        {/* ==================================================================== */}
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 14 }}>
          <Stat
            label="CONNECTED DEVICES"
            value={String(data.deviceCount)}
            detail={`${data.onlineCount} online · ${data.offlineCount} offline`}
          />
          <Stat
            label="PENDING REQUESTS"
            value={String(data.pendingRequests)}
            detail={
              data.pendingRequests > 0 ? "Requires review" : "All caught up"
            }
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
          <Stat
            label="ACTIVE ALERTS"
            value={String(data.activeAlertsCount)}
            detail={
              data.activeAlertsCount > 0
                ? "Check incidents"
                : "Family is secure"
            }
          />
          <Stat
            label="AVG SCREEN TIME"
            value="1h 55m"
            detail="Today across devices"
          />
        </View>

        {/* ==================================================================== */}
        {/* 3. Screen Time Trends Chart */}
        {/* ==================================================================== */}
        <View style={homeStyles.chartCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <View>
              <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>
                Daily Screen Time
              </Text>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                Weekly activity trends
              </Text>
            </View>
            <Link href="/screen-time" asChild>
              <Pressable>
                <Text
                  style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}
                >
                  Manage Limits ›
                </Text>
              </Pressable>
            </Link>
          </View>

          <View style={homeStyles.chartBarsContainer}>
            {data.screenTimeBreakdown.map((bar, index) => {
              const heightPercent = Math.min(
                (bar.minutes / maxChartMinutes) * 100,
                100,
              );
              const isToday = index === 4;
              return (
                <View key={bar.day} style={homeStyles.chartColumn}>
                  <Text
                    style={{
                      fontSize: 9,
                      color: C.muted,
                      marginBottom: 4,
                    }}
                  >
                    {formatHoursMinutes(bar.minutes)}
                  </Text>
                  <View style={homeStyles.barBackground}>
                    <View
                      style={[
                        homeStyles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isToday ? C.blue : "#93C5FD",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      homeStyles.chartDayLabel,
                      isToday && { color: C.blue, fontWeight: "800" },
                    ]}
                  >
                    {bar.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 4. Quick Actions Grid */}
        {/* ==================================================================== */}
        <Text style={homeStyles.sectionTitle}>
          Parent Controls & Management
        </Text>
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
            right={
              data.pendingRequests > 0 ? `(${data.pendingRequests}) ›` : "›"
            }
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

        {/* ==================================================================== */}
        {/* 5. Recent Alerts Feed */}
        {/* ==================================================================== */}
        {data.recentAlerts.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={homeStyles.sectionTitle}>
                Recent Security Events
              </Text>
              <Link href="/alerts" asChild>
                <Pressable>
                  <Text
                    style={{
                      color: C.blue,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    View All ›
                  </Text>
                </Pressable>
              </Link>
            </View>

            {data.recentAlerts.map((alert) => (
              <View key={alert.id} style={homeStyles.alertRow}>
                <View
                  style={[
                    homeStyles.severityBadge,
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
                  <Text
                    style={{
                      color: C.navy,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    {alert.title}
                  </Text>
                  <Text
                    style={{
                      color: C.muted,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {alert.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer Brand Tag */}
        <View style={{ paddingVertical: 18, alignItems: "center" }}>
          <Text style={{ color: "#9AA5B5", fontSize: 11, fontWeight: "600" }}>
            PARENTAL CONTROL SYSTEM • REAL BACKEND SYNC
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default HomeScreen;
