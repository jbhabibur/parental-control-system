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
// PARENT LOGIN SCREEN
// =====================================

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // =====================================
  // LOGIN FUNCTION
  // =====================================

  const submit = async () => {
    if (busy) return;

    // Required fields
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setBusy(true);

    try {
      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
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
            "Login failed. Please check your credentials.",
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

      Alert.alert("Login Successful", `Welcome back ${result.user.name}!`);

      // Navigate directly to Dashboard
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert(
        "Login Failed",
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
        title="Welcome back"
        subtitle="Sign in to your parent account"
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
          Sign in to manage connected child devices and family safety settings.
        </Text>
      </View>

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

      <View>
        <Field
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />

        {/* Show / Hide Password */}

        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 15,
            top: 42,
            padding: 5,
          }}
        >
          <Text
            style={{
              color: C.blue,
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </Text>
        </Pressable>
      </View>

      {/* Forgot Password */}

      <View
        style={{
          alignItems: "flex-end",
          marginTop: 5,
          marginBottom: 22,
        }}
      >
        <Link href="/auth/forgot-password" asChild>
          <Pressable disabled={busy}>
            <Text
              style={{
                color: C.blue,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              Forgot password?
            </Text>
          </Pressable>
        </Link>
      </View>

      {/* Login Button */}

      <Button
        title={busy ? "Signing in..." : "Sign in"}
        onPress={submit}
        disabled={busy}
      />

      {/* Register Navigation */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <Text style={{ color: C.muted }}>Don't have an account? </Text>

        <Link href="/auth/register" asChild>
          <Pressable disabled={busy}>
            <Text
              style={{
                color: C.blue,
                fontWeight: "800",
              }}
            >
              Create account
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
