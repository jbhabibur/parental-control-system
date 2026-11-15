/**
 * ============================================================================
 * Feature: Settings - UI Component
 * ============================================================================
 * Visual presentation for Parent Administrator Settings & Navigation Center.
 * Displays:
 * 1. Parent administrator profile card (Name, Email, Role, Status)
 * 2. Family & Policy hubs navigation list (Security, Reports, Notifications, etc.)
 * 3. Application preferences toggles (Push notifications, Biometrics, Dark Mode)
 * 4. Backend system connection status
 * 5. Sign out button with confirmation alert
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
import { Link } from "expo-router";
import { C, PageHeader, Screen } from "../../components/ui";
import { useSettings } from "./useSettings";
import { settingsStyles } from "./settings.styles";

export function SettingsScreen() {
  const {
    user,
    healthStatus,
    loading,
    busyLogout,
    pushEnabled,
    bioEnabled,
    darkMode,
    togglePush,
    toggleBio,
    toggleDark,
    confirmSignOut,
  } = useSettings();

  const renderNavRow = (
    icon: string,
    label: string,
    href: string,
    detail?: string,
  ) => (
    <Link key={label} href={href as any} asChild>
      <Pressable style={settingsStyles.navRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
          <Text style={{ color: C.navy, fontWeight: "800", fontSize: 14 }}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {!!detail && (
            <Text style={{ color: C.muted, fontSize: 12 }}>{detail}</Text>
          )}
          <Text style={{ color: C.blue, fontSize: 18, fontWeight: "900" }}>
            ›
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <Screen>
      <PageHeader
        title="Settings"
        subtitle="Parent administrator preferences & security controls"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <ActivityIndicator color={C.blue} style={{ marginBottom: 12 }} />
        )}

        {/* ==================================================================== */}
        {/* 1. Parent Profile Card */}
        {/* ==================================================================== */}
        <View style={settingsStyles.profileCard}>
          <View style={settingsStyles.profileAvatar}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.navy, fontSize: 17, fontWeight: "900" }}>
              {user?.name || "Parent Administrator"}
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
              {user?.email || "parent@example.com"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
              }}
            >
              <View style={settingsStyles.rolePill}>
                <Text
                  style={{ color: C.blue, fontSize: 10, fontWeight: "800" }}
                >
                  ROLE: {user?.role || "PARENT"}
                </Text>
              </View>
              <View
                style={[
                  settingsStyles.rolePill,
                  { backgroundColor: "#DCFCE7" },
                ]}
              >
                <Text
                  style={{ color: C.green, fontSize: 10, fontWeight: "800" }}
                >
                  STATUS: {user?.status || "ACTIVE"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 2. Management & Navigation Hub */}
        {/* ==================================================================== */}
        <Text style={settingsStyles.sectionHeader}>FAMILY & POLICY HUBS</Text>
        <View style={settingsStyles.card}>
          {renderNavRow("🔐", "Security Center & 2FA", "/security", "Protected")}
          {renderNavRow("📊", "Reports & Analytics", "/reports", "Usage Trends")}
          {renderNavRow("🔔", "Notification Center", "/notifications", "Alerts")}
          {renderNavRow("📱", "Device Management", "/devices", "Pair Devices")}
          {renderNavRow(
            "⏱️",
            "Screen Time & Bedtime",
            "/screen-time",
            "Daily Quotas",
          )}
          {renderNavRow(
            "🌐",
            "Safe Browser & DNS",
            "/browser-policy",
            "Web Filter",
          )}
          {renderNavRow(
            "🛡️",
            "Application Policies",
            "/app-policies",
            "App Rules",
          )}
          {renderNavRow("📍", "Location Tracking", "/location", "Live GPS")}
        </View>

        {/* ==================================================================== */}
        {/* 3. Preferences */}
        {/* ==================================================================== */}
        <Text style={settingsStyles.sectionHeader}>
          APPLICATION PREFERENCES
        </Text>
        <View style={settingsStyles.card}>
          <View style={settingsStyles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.switchLabel}>Push Notifications</Text>
              <Text style={settingsStyles.switchSub}>
                Alert when permission requests or threats arise
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => void togglePush(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>

          <View style={settingsStyles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.switchLabel}>Biometric App Lock</Text>
              <Text style={settingsStyles.switchSub}>
                Require FaceID or Fingerprint on app open
              </Text>
            </View>
            <Switch
              value={bioEnabled}
              onValueChange={(val) => void toggleBio(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>

          <View style={[settingsStyles.switchRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.switchLabel}>
                Dark Interface Theme
              </Text>
              <Text style={settingsStyles.switchSub}>
                Reduce screen glare during evening hours
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => void toggleDark(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 4. System & Health */}
        {/* ==================================================================== */}
        <Text style={settingsStyles.sectionHeader}>SYSTEM & CONNECTION</Text>
        <View style={settingsStyles.card}>
          <View style={settingsStyles.infoLine}>
            <Text style={{ color: C.muted, fontSize: 13 }}>
              Backend API Status
            </Text>
            <Text
              style={{
                color: healthStatus === "Healthy" ? C.green : C.navy,
                fontWeight: "800",
                fontSize: 13,
              }}
            >
              {healthStatus}
            </Text>
          </View>
          <View style={[settingsStyles.infoLine, { borderBottomWidth: 0 }]}>
            <Text style={{ color: C.muted, fontSize: 13 }}>Client Version</Text>
            <Text style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}>
              v1.0.0 (Production)
            </Text>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 5. Sign Out Button */}
        {/* ==================================================================== */}
        <Pressable
          accessibilityRole="button"
          disabled={busyLogout}
          onPress={confirmSignOut}
          style={settingsStyles.logoutButton}
        >
          <Text style={{ color: C.red, fontWeight: "900", fontSize: 14 }}>
            {busyLogout ? "Signing Out..." : "Sign Out of Account"}
          </Text>
        </Pressable>

        <View style={{ marginVertical: 20, alignItems: "center" }}>
          <Text style={{ color: "#9AA5B5", fontSize: 11, fontWeight: "600" }}>
            PARENTAL CONTROL SYSTEM • SECURE SESSION
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default SettingsScreen;
