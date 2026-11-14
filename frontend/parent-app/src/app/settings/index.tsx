import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api, getStored, setStored } from "../../lib/api";
import { useAuth } from "../../context/auth-context";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const [healthStatus, setHealthStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);
  const [busyLogout, setBusyLogout] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const [healthRes, bioPref, pushPref, darkPref] = await Promise.all([
          api.health().catch(() => ({ status: "Unreachable" })),
          getStored("parent-control.pref.biometric"),
          getStored("parent-control.pref.push"),
          getStored("parent-control.pref.dark"),
        ]);

        if (!active) return;
        setHealthStatus(String(healthRes.status || "Healthy"));
        setBioEnabled(bioPref === "true");
        setPushEnabled(pushPref !== "false");
        setDarkMode(darkPref === "true");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const togglePush = async (val: boolean) => {
    setPushEnabled(val);
    await setStored("parent-control.pref.push", val ? "true" : "false");
  };

  const toggleBio = async (val: boolean) => {
    setBioEnabled(val);
    await setStored("parent-control.pref.biometric", val ? "true" : "false");
  };

  const toggleDark = async (val: boolean) => {
    setDarkMode(val);
    await setStored("parent-control.pref.dark", val ? "true" : "false");
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your parent account? Active monitoring policies will continue running on connected child devices.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setBusyLogout(true);
            try {
              await logout();
              router.replace("/auth/login");
            } catch {
              router.replace("/auth/login");
            } finally {
              setBusyLogout(false);
            }
          },
        },
      ],
    );
  };

  const renderNavRow = (icon: string, label: string, href: string, detail?: string) => (
    <Link key={label} href={href as any} asChild>
      <Pressable style={setStyles.navRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
          <Text style={{ color: C.navy, fontWeight: "800", fontSize: 14 }}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {!!detail && <Text style={{ color: C.muted, fontSize: 12 }}>{detail}</Text>}
          <Text style={{ color: C.blue, fontSize: 18, fontWeight: "900" }}>›</Text>
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
        {loading && <ActivityIndicator color={C.blue} style={{ marginBottom: 12 }} />}

        {/* Parent Profile Card */}
        <View style={setStyles.profileCard}>
          <View style={setStyles.profileAvatar}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.navy, fontSize: 17, fontWeight: "900" }}>
              {user?.name || "Parent Administrator"}
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
              {user?.email || "parent@example.com"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
              <View style={setStyles.rolePill}>
                <Text style={{ color: C.blue, fontSize: 10, fontWeight: "800" }}>
                  ROLE: {user?.role || "PARENT"}
                </Text>
              </View>
              <View style={[setStyles.rolePill, { backgroundColor: "#DCFCE7" }]}>
                <Text style={{ color: C.green, fontSize: 10, fontWeight: "800" }}>
                  STATUS: {user?.status || "ACTIVE"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Management & Navigation Hub */}
        <Text style={setStyles.sectionHeader}>FAMILY & POLICY HUBS</Text>
        <View style={setStyles.card}>
          {renderNavRow("🔐", "Security Center & 2FA", "/security", "Protected")}
          {renderNavRow("📊", "Reports & Analytics", "/reports", "Usage Trends")}
          {renderNavRow("🔔", "Notification Center", "/notifications", "Alerts")}
          {renderNavRow("📱", "Device Management", "/devices", "Pair Devices")}
          {renderNavRow("⏱️", "Screen Time & Bedtime", "/screen-time", "Daily Quotas")}
          {renderNavRow("🌐", "Safe Browser & DNS", "/browser-policy", "Web Filter")}
          {renderNavRow("🛡️", "Application Policies", "/app-policies", "App Rules")}
          {renderNavRow("📍", "Location Tracking", "/location", "Live GPS")}
        </View>

        {/* Preferences */}
        <Text style={setStyles.sectionHeader}>APPLICATION PREFERENCES</Text>
        <View style={setStyles.card}>
          <View style={setStyles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={setStyles.switchLabel}>Push Notifications</Text>
              <Text style={setStyles.switchSub}>Alert when permission requests or threats arise</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => void togglePush(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>

          <View style={setStyles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={setStyles.switchLabel}>Biometric App Lock</Text>
              <Text style={setStyles.switchSub}>Require FaceID or Fingerprint on app open</Text>
            </View>
            <Switch
              value={bioEnabled}
              onValueChange={(val) => void toggleBio(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>

          <View style={[setStyles.switchRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={setStyles.switchLabel}>Dark Interface Theme</Text>
              <Text style={setStyles.switchSub}>Reduce screen glare during evening hours</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => void toggleDark(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>
        </View>

        {/* System & Health */}
        <Text style={setStyles.sectionHeader}>SYSTEM & CONNECTION</Text>
        <View style={setStyles.card}>
          <View style={setStyles.infoLine}>
            <Text style={{ color: C.muted, fontSize: 13 }}>Backend API Status</Text>
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
          <View style={[setStyles.infoLine, { borderBottomWidth: 0 }]}>
            <Text style={{ color: C.muted, fontSize: 13 }}>Client Version</Text>
            <Text style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}>v1.0.0 (Production)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          accessibilityRole="button"
          disabled={busyLogout}
          onPress={confirmSignOut}
          style={setStyles.logoutButton}
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

const setStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
  },
  rolePill: {
    backgroundColor: C.pale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionHeader: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
  },
  navRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  switchRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  switchLabel: {
    color: C.navy,
    fontSize: 14,
    fontWeight: "800",
  },
  switchSub: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2,
  },
  infoLine: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logoutButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FFF1F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
});
