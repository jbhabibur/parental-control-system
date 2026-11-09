
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";

export default function DeviceRegistrationScreen() {
  const deviceName = Device.deviceName || "My Device";
  const deviceType =
    Platform.OS === "android" ? "Android" : "iOS";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>
          <Text style={styles.logoText}>ChildSafe</Text>
        </View>

        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>📱</Text>
        </View>

        <Text style={styles.title}>Device Registration</Text>

        <Text style={styles.subtitle}>
          Register this device with your parent's account.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device Name</Text>
            <Text style={styles.infoValue}>{deviceName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>{deviceType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registration Status</Text>
            <Text style={styles.pending}>Not Registered</Text>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.8}
            onPress={() => router.push("/permissions")}
          >
            <Text style={styles.registerButtonText}>
              Register Device →
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Demo only: Actual device registration will be
            connected to the backend later.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ChildSafe Parental Control
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 45,
  },
  backButton: {
    marginBottom: 25,
  },
  backText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logoCircle: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: 29,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 8,
  },
  illustration: {
    width: 105,
    height: 105,
    borderRadius: 30,
    backgroundColor: "#DBEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  illustrationIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 9,
    marginBottom: 25,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 18,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },
  pending: {
    color: "#D97706",
    fontWeight: "700",
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  note: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 18,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
  },
  version: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 5,
  },
});
