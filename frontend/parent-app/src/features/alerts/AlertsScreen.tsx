/**
 * ============================================================================
 * Feature: Alerts - UI Component
 * ============================================================================
 * Visual presentation for Safety Alerts & Incident Notifications.
 * Displays:
 * 1. Alerts count header
 * 2. Unacknowledged indicator dots
 * 3. Detailed descriptions and timestamps
 * 4. 1-tap "Acknowledge" button
 */

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { useAlerts } from "./useAlerts";
import { alertsStyles } from "./alerts.styles";

export function AlertsScreen() {
  const { alerts, loading, busyId, error, acknowledge } = useAlerts();

  return (
    <Screen>
      <PageHeader
        title="Alerts"
        subtitle="Safety alerts reported by paired child devices."
      />

      <Text style={alertsStyles.alertCountText}>{alerts.length} alerts</Text>

      {loading && <ActivityIndicator color={C.blue} />}

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}

      {!loading && !error && alerts.length === 0 && (
        <Text style={{ color: C.muted }}>No alerts found.</Text>
      )}

      <View style={{ gap: 10 }}>
        {alerts.map((alert) => (
          <View key={alert.id} style={alertsStyles.card}>
            <View style={alertsStyles.iconBox}>
              <View style={alertsStyles.iconDot} />
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <Text style={alertsStyles.titleText}>
                  {alert.title || alert.type.replaceAll("_", " ")}
                </Text>
                {!alert.acknowledgedAt && (
                  <View style={alertsStyles.unreadDot} />
                )}
              </View>

              <Text style={alertsStyles.timestampText}>
                {new Date(alert.createdAt).toLocaleString()} ·{" "}
                {alert.severity || alert.type}
              </Text>

              <Text style={alertsStyles.descriptionText}>
                {alert.description || alert.type.replaceAll("_", " ")}
              </Text>

              {!alert.acknowledgedAt && (
                <Pressable
                  accessibilityRole="button"
                  disabled={busyId === alert.id}
                  onPress={() => void acknowledge(alert.id)}
                  style={alertsStyles.ackButton}
                >
                  <Text style={alertsStyles.ackButtonText}>
                    {busyId === alert.id ? "Saving..." : "Acknowledge"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

export default AlertsScreen;
