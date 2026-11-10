import React from "react";
import { router } from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🛡️</Text>
            </View>

            <Text style={styles.logoText}>ChildSafe</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Welcome Back!</Text>

            <Text style={styles.subtitle}>
              Connect this device with a code from your parent
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.subtitle}>
              Child accounts do not sign in with email and password. Pairing
              uses a one-time code.
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={() => router.push("/(auth)/pairing")}
            >
              <Text style={styles.loginButtonText}>Continue to pairing</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>ChildSafe Parental Control</Text>

            <Text style={styles.footerVersion}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  content: {
    width: "100%",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 45,
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  logoIcon: {
    fontSize: 38,
  },

  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1E40AF",
  },

  headingContainer: {
    marginBottom: 30,
  },

  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 9,
  },

  loginButton: {
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  footer: {
    alignItems: "center",
    marginTop: 65,
  },

  footerText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  footerVersion: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 7,
  },
});
