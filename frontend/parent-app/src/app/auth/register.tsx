import React, { useState } from "react";
import { Text, View, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Screen, PageHeader, Field, Button, C } from "../../components/ui";
import { ApiError, api, saveTokens } from "../../lib/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Missing information", "Please complete all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const result = await api.auth.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (
        typeof result.accessToken !== "string" ||
        typeof result.refreshToken !== "string"
      ) {
        throw new Error("The server did not return a valid account session.");
      }
      await saveTokens("user", {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert(
        "Account creation failed",
        error instanceof ApiError
          ? error.message
          : "Unable to create the account. Please try again.",
      );
    } finally {
      setBusy(false);
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
        <Text style={{ color: C.blue, fontWeight: "800", fontSize: 15 }}>
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
      <Button
        title={busy ? "Creating account..." : "Create account"}
        onPress={submit}
      />
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
            <Text style={{ color: C.blue, fontWeight: "800" }}>Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
