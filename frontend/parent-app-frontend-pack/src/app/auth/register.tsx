import React, { useState } from "react";
import { Text, View, Alert, Pressable, ActivityIndicator } from "react-native";

import { Link, router } from "expo-router";

import { Screen, PageHeader, Field, Button, C } from "../../components/ui";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    // 1. Empty field validation
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }

    // 2. Email validation
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    // 3. Password validation
    if (password.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }

    // 4. Confirm password validation
    if (password !== confirm) {
      Alert.alert("Password mismatch", "The passwords do not match.");
      return;
    }

    if (!API_BASE_URL) {
      Alert.alert(
        "Configuration error",
        "API URL is missing. Please configure EXPO_PUBLIC_API_URL.",
      );
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // 5. API request
      const response = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/auth/register`,
        {
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
        },
      );

      // 6. Read backend response
      const result = await response.json();

      // 7. Handle backend errors
      if (!response.ok || result.success === false) {
        const backendErrors = result.errors;

        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          const errorMessage = backendErrors
            .map((error) => `${error.field}: ${error.message}`)
            .join("\n");

          Alert.alert(result.message || "Validation failed", errorMessage);

          return;
        }

        Alert.alert(
          "Registration failed",
          result.message || "Something went wrong. Please try again.",
        );

        return;
      }

      // 8. Registration successful
      Alert.alert(
        "Registration successful",
        result.message || "Your parent account has been created successfully.",
        [
          {
            text: "Continue to sign in",
            onPress: () => {
              router.replace("/auth/login");
            },
          },
        ],
      );

      // 9. Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      console.error("Registration error:", error);

      Alert.alert(
        "Connection error",
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Create account"
        subtitle="Set up your parent account"
      />

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

      <Field
        label="Full name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      <Field
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Field
        label="Password"
        placeholder="At least 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Field
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {/* Registration Button */}

      <Button
        title={loading ? "Creating account..." : "Create account"}
        onPress={submit}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          color={C.blue}
          style={{ marginTop: 12 }}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <Text style={{ color: C.muted }}>Already have an account? </Text>

        <Link href="/auth/login" asChild>
          <Pressable>
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
