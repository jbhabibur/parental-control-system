/**
 * ============================================================================
 * Feature: Activity - UI Component
 * ============================================================================
 * Visual presentation for App Usage, Device Events, and Web History.
 * Displays:
 * 1. Selected device indicator
 * 2. App usage cards with formatted minutes and timestamps
 * 3. System device events list
 * 4. Browsing history with domain and blocked indicators
 */

import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { useActivity } from "./useActivity";
import { activityStyles } from "./activity.styles";

export function ActivityScreen() {
  const {
    deviceName,
    usage,
    activities,
    history,
    loading,
    error,
    formatDate,
    formatDuration,
  } = useActivity();

  return (
    <Screen>
      <PageHeader
        title="Activity"
        subtitle="App sessions, device activity, and browsing history from the backend."
      />

      {loading && <ActivityIndicator color={C.blue} />}

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}

      {!loading && !error && !deviceName && (
        <Text style={activityStyles.emptyNotice}>
          Connect a child device to view activity.
        </Text>
      )}

      {!!deviceName && (
        <Text style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>
          Device: {deviceName}
        </Text>
      )}

      {/* ==================================================================== */}
      {/* 1. App Usage Section */}
      {/* ==================================================================== */}
      <Text style={activityStyles.sectionTitle}>
        App usage ({usage.length})
      </Text>

      {usage.length === 0 && !loading && (
        <Text style={activityStyles.emptyNotice}>
          No app usage records have been reported.
        </Text>
      )}

      {usage.map((row, index) => (
        <View key={String(row.id || index)} style={activityStyles.usageCard}>
          <Text style={activityStyles.usageTitle}>
            {String(row.appIdentifier || "App")}
          </Text>
          <Text style={activityStyles.usageDetail}>
            {formatDuration(row.durationSeconds)} · {formatDate(row.startedAt)}
          </Text>
        </View>
      ))}

      {/* ==================================================================== */}
      {/* 2. Device Events Section */}
      {/* ==================================================================== */}
      <Text
        style={[
          activityStyles.sectionTitle,
          { marginTop: 18, marginBottom: 9 },
        ]}
      >
        Device events ({activities.length})
      </Text>

      {activities.map((row, index) => (
        <View key={String(row.id || index)} style={activityStyles.eventRow}>
          <Text style={activityStyles.eventTitle}>
            {String(row.activityType || "Activity")}
          </Text>
          <Text style={activityStyles.eventSubtitle}>
            {formatDate(row.capturedAt)}
            {row.foregroundApp ? ` · ${String(row.foregroundApp)}` : ""}
          </Text>
        </View>
      ))}

      {/* ==================================================================== */}
      {/* 3. Browsing History Section */}
      {/* ==================================================================== */}
      <Text
        style={[
          activityStyles.sectionTitle,
          { marginTop: 18, marginBottom: 9 },
        ]}
      >
        Browsing history ({history.length})
      </Text>

      {history.map((row, index) => (
        <View key={String(row.id || index)} style={activityStyles.historyRow}>
          <Text
            numberOfLines={1}
            style={activityStyles.historyTitle}
          >
            {String(
              row.pageTitle || row.domain || row.url || "Visited page",
            )}
          </Text>
          <Text style={activityStyles.historySubtitle}>
            {String(row.domain || "")} · {formatDate(row.visitedAt)}
            {row.blocked ? " · blocked" : ""}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

export default ActivityScreen;
