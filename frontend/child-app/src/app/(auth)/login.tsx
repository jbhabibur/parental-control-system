
import React, { useState } from "react";
import { router } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
              Sign in to access your child account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPassword}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={() => router.push("/(auth)/pairing")}
            >
              <Text style={styles.loginButtonText}>
                Sign In
              </Text>
            </TouchableOpacity>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ChildSafe Parental Control
            </Text>

            <Text style={styles.footerVersion}>
              Version 1.0.0
            </Text>
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

  input: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 15,
    marginBottom: 22,
    color: "#111827",
  },

  passwordContainer: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 25,
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  showPassword: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
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
