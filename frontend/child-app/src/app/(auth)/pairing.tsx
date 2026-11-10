import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  ApiError,
  api,
  getOrCreateDeviceIdentifier,
  saveTokens,
} from "../../lib/api";

export default function PairingScreen() {
  const [pairingCode, setPairingCode] = useState("");
  const [busy, setBusy] = useState(false);

  const completePairing = async () => {
    const code = pairingCode.replace(/\D/g, "");
    if (code.length !== 6) {
      Alert.alert(
        "Invalid code",
        "Enter the 6-digit pairing code from the parent app.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await api.pairing.complete({
        pairingCode: code,
        deviceIdentifier: await getOrCreateDeviceIdentifier(),
        deviceName: Device.deviceName || Device.modelName || "Child device",
        platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
        osVersion: Device.osVersion || undefined,
        appVersion: Constants.expoConfig?.version || undefined,
      });
      const session = result.data as
        | { accessToken?: string; refreshToken?: string }
        | undefined;
      if (!session?.accessToken || !session.refreshToken)
        throw new Error("The server did not return device credentials.");
      await saveTokens("device", {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      router.replace("/monitoring-status");
    } catch (error) {
      Alert.alert(
        "Pairing failed",
        error instanceof ApiError
          ? error.message
          : "Unable to pair this device. Please check the code and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

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

        {/* Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>

          <Text style={styles.logoText}>ChildSafe</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>🔗</Text>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Connect to Parent</Text>

        <Text style={styles.subtitle}>
          Connect your device to your parent's account to get started.
        </Text>

        {/* Pairing Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Pairing</Text>

          <Text style={styles.description}>
            Ask your parent to open the Parent App and provide you with the
            pairing code.
          </Text>

          <Text style={styles.label}>Pairing Code</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter pairing code"
            placeholderTextColor="#94A3B8"
            value={pairingCode}
            onChangeText={setPairingCode}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TouchableOpacity
            style={styles.connectButton}
            activeOpacity={0.8}
            onPress={completePairing}
          >
            <Text style={styles.connectButtonText}>
              {busy ? "Connecting..." : "Connect to Parent →"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ChildSafe Parental Control</Text>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
    paddingVertical: 8,
  },

  backText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  logoIcon: {
    fontSize: 34,
  },

  logoText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1E40AF",
    marginTop: 8,
  },

  illustration: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 25,
  },

  illustrationIcon: {
    fontSize: 48,
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  connectButton: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  connectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    marginTop: 40,
  },

  footerText: {
    fontSize: 12,
    color: "#64748B",
  },

  version: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
  },
});
