import React, { useState } from "react";
import { Text, View, Alert, Pressable } from "react-native";

import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { Screen, PageHeader, Field, Button, C } from "../../components/ui";

// =====================================
// API CONFIGURATION
// =====================================

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://10.26.8.37:5000"
).replace(/\/+$/, "");

// =====================================
// PARENT REGISTRATION SCREEN
// =====================================

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);

  // =====================================
  // REGISTER FUNCTION
  // =====================================

  const submit = async () => {
    if (busy) return;

    // Required fields
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Missing Information", "Please complete all fields.");
      return;
    }

    // Name validation
    if (name.trim().length < 2 || name.trim().length > 100) {
      Alert.alert("Invalid Name", "Name must contain 2-100 characters.");
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 8 || password.length > 72) {
      Alert.alert("Invalid Password", "Password must contain 8-72 characters.");
      return;
    }

    // Confirm password
    if (password !== confirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const result = await response.json();

      // =====================================
      // ERROR HANDLING
      // =====================================

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.errors?.[0]?.message ||
            "Registration failed.",
        );
      }

      // =====================================
      // RESPONSE VALIDATION
      // =====================================

      if (
        !result.success ||
        !result.user ||
        typeof result.accessToken !== "string" ||
        typeof result.refreshToken !== "string"
      ) {
        throw new Error("Invalid server response.");
      }

      // =====================================
      // SAVE AUTH TOKENS
      // =====================================

      await SecureStore.setItemAsync("user_access_token", result.accessToken);

      await SecureStore.setItemAsync("user_refresh_token", result.refreshToken);

      // =====================================
      // SUCCESS
      // =====================================

      Alert.alert("Registration Successful", `Welcome ${result.user.name}!`, [
        {
          text: "Continue",
          onPress: () => {
            router.replace("/dashboard");
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <Screen>
      <PageHeader
        title="Create account"
        subtitle="Set up your parent account"
      />

      {/* Information Card */}

      <View
        style={{
          backgroundColor: C.pale,
          padding: 17,
          borderRadius: 16,
          marginBottom: 22,
        }}
      >
        <Text
          style={{
            color: C.blue,
            fontWeight: "800",
            fontSize: 15,
          }}
        >
          Parent Control
        </Text>

        <Text
          style={{
            color: "#52647F",
            fontSize: 12,
            lineHeight: 18,
            marginTop: 5,
          }}
        >
          Create an account to manage connected child devices and family safety
          settings.
        </Text>
      </View>

      {/* Full Name */}

      <Field
        label="Full name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      {/* Email */}

      <Field
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}

      <Field
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm Password */}

      <Field
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {/* Register Button */}

      <Button
        title={busy ? "Creating account..." : "Create account"}
        onPress={submit}
        disabled={busy}
      />

      {/* Login Navigation */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <Text style={{ color: C.muted }}>Already have an account? </Text>

        <Link href="/auth/login" asChild>
          <Pressable disabled={busy}>
            <Text
              style={{
                color: C.blue,
                fontWeight: "800",
              }}
            >
              Sign in
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
