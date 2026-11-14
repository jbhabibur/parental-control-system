import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Button, C, Field, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";
import { ParentUser, useAuth } from "../../context/auth-context";

export default function RegisterScreen() {
  const { loginSuccess } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (busy) return;

    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      Alert.alert("Invalid Name", "Name must be between 2 and 100 characters.");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters and no more than 72 characters.",
      );
      return;
    }

    if (password !== confirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (!agreed) {
      Alert.alert(
        "Consent Required",
        "Please accept the Terms of Service & Parental Consent to proceed.",
      );
      return;
    }

    setBusy(true);
    try {
      const result = await api.auth.register({
        name: trimmedName,
        email: email.trim().toLowerCase(),
        password,
      });

      if (
        !result.user ||
        typeof result.accessToken !== "string" ||
        typeof result.refreshToken !== "string"
      ) {
        throw new Error("The server did not return a valid account session.");
      }

      await loginSuccess(result.user as ParentUser, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      Alert.alert("Welcome!", "Your parent account has been successfully created.");
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Create Account"
        subtitle="Set up your parent administrator account"
      />

      <View
        style={{
          backgroundColor: C.pale,
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#D7E5FF",
        }}
      >
        <Text style={{ color: C.blue, fontWeight: "800", fontSize: 15 }}>
          🛡️ Family Protection Administrator
        </Text>
        <Text
          style={{
            color: "#475569",
            fontSize: 12,
            lineHeight: 18,
            marginTop: 6,
          }}
        >
          As the parent administrator, you will manage connected devices, enforce screen time rules, and supervise web activity.
        </Text>
      </View>

      <Field
        label="Full Name"
        placeholder="Parent or Guardian Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Field
        label="Email Address"
        placeholder="parent@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Field
        label="Password (min 8 characters)"
        placeholder="Create a strong password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ padding: 10 }}
          >
            <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        }
      />

      <Field
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry={!showConfirm}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showConfirm ? "Hide password" : "Show password"}
            onPress={() => setShowConfirm((prev) => !prev)}
            style={{ padding: 10 }}
          >
            <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>
              {showConfirm ? "Hide" : "Show"}
            </Text>
          </Pressable>
        }
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginVertical: 14,
          paddingHorizontal: 4,
        }}
      >
        <Switch
          value={agreed}
          onValueChange={setAgreed}
          trackColor={{ false: "#CBD5E1", true: C.blue }}
          thumbColor={C.white}
        />
        <Text style={{ flex: 1, color: C.text, fontSize: 12, lineHeight: 17 }}>
          I agree to the Terms of Service and consent to parental device monitoring for my children.
        </Text>
      </View>

      <Button
        title={busy ? "Creating Account..." : "Create Parent Account"}
        disabled={busy}
        onPress={() => void handleRegister()}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <Text style={{ color: C.muted, fontSize: 14 }}>Already have an account? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={{ color: C.blue, fontWeight: "800", fontSize: 14 }}>
              Sign In
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
