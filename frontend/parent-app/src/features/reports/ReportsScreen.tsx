/**
 * ============================================================================
 * Feature: Reports - UI Component
 * ============================================================================
 * Visual presentation for Family Safety Trends & Analytical Audit.
 * Displays:
 * 1. Device filter carousel
 * 2. Time range selector tabs (Today, Past 7 Days, Past 30 Days)
 * 3. KPI stats cards (Apps Monitored, Blocked Domains, Incidents, Requests)
 * 4. Screen time weekly bar chart
 * 5. Protection status overview
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
import { C, PageHeader, Screen, Stat } from "../../components/ui";
import { useReports } from "./useReports";
import { reportsStyles } from "./reports.styles";

export function ReportsScreen() {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    timeRange,
    setTimeRange,
    loading,
    refreshing,
    error,
    stats,
    weeklyData,
    maxHours,
    onRefresh,
  } = useReports();

  return (
    <Screen>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive family safety trends & activity audit"
      />

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
        {/* 1. Device Filter */}
        {/* ==================================================================== */}
        {devices.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={reportsStyles.subHeader}>DEVICE FILTER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {devices.map((d) => {
                const isSelected = selectedDeviceId === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setSelectedDeviceId(d.id)}
                    style={[
                      reportsStyles.chip,
                      isSelected && reportsStyles.activeChip,
                    ]}
                  >
                    <Text
                      style={[
                        reportsStyles.chipText,
                        isSelected && reportsStyles.activeChipText,
                      ]}
                    >
                      {d.deviceName} ({d.platform})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* 2. Time Range Selector */}
        {/* ==================================================================== */}
        <View style={reportsStyles.rangeRow}>
          {(["TODAY", "WEEK", "MONTH"] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setTimeRange(r)}
              style={[
                reportsStyles.rangeBtn,
                timeRange === r && reportsStyles.activeRangeBtn,
              ]}
            >
              <Text
                style={[
                  reportsStyles.rangeBtnText,
                  timeRange === r && reportsStyles.activeRangeBtnText,
                ]}
              >
                {r === "TODAY"
                  ? "Today"
                  : r === "WEEK"
                    ? "Past 7 Days"
                    : "Past 30 Days"}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading && !refreshing && (
          <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />
        )}

        {!!error && (
          <View style={reportsStyles.errorBox}>
            <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>
              {error}
            </Text>
          </View>
        )}

        {/* ==================================================================== */}
        {/* 3. Summary Metrics */}
        {/* ==================================================================== */}
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

        {/* ==================================================================== */}
        {/* 4. Screen Time Analytics Chart */}
        {/* ==================================================================== */}
        <View style={reportsStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>
            Screen Time Trends
          </Text>
          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              marginTop: 2,
              marginBottom: 14,
            }}
          >
            Aggregated usage over selected period
          </Text>

          <View style={reportsStyles.chartContainer}>
            {weeklyData.map((d) => {
              const heightPct = Math.min((d.hours / maxHours) * 100, 100);
              return (
                <View key={d.day} style={reportsStyles.chartCol}>
                  <Text
                    style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}
                  >
                    {d.hours}h
                  </Text>
                  <View style={reportsStyles.barSlot}>
                    <View
                      style={[
                        reportsStyles.barFill,
                        { height: `${heightPct}%`, backgroundColor: C.blue },
                      ]}
                    />
                  </View>
                  <Text style={reportsStyles.dayLabel}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 5. Category Breakdown Card */}
        {/* ==================================================================== */}
        <View style={reportsStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "800" }}>
            Protection & Policy Status
          </Text>
          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              marginTop: 2,
              marginBottom: 14,
            }}
          >
            Overview of enforcement across child activities
          </Text>

          <View style={reportsStyles.metricRow}>
            <Text style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}>
              SafeSearch Enforcement
            </Text>
            <Text style={{ color: C.green, fontWeight: "800", fontSize: 13 }}>
              Active
            </Text>
          </View>

          <View style={reportsStyles.metricRow}>
            <Text style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}>
              Bedtime Curtailment
            </Text>
            <Text style={{ color: C.blue, fontWeight: "800", fontSize: 13 }}>
              21:00 – 07:00
            </Text>
          </View>

          <View style={[reportsStyles.metricRow, { borderBottomWidth: 0 }]}>
            <Text style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}>
              GPS Location History
            </Text>
            <Text style={{ color: C.green, fontWeight: "800", fontSize: 13 }}>
              Synchronized
            </Text>
          </View>
        </View>

        {/* Return Button */}
        <Link href="/dashboard" asChild>
          <Pressable style={reportsStyles.backButton}>
            <Text style={{ color: C.blue, fontWeight: "800", fontSize: 14 }}>
              ← Return to Dashboard
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </Screen>
  );
}

export default ReportsScreen;
