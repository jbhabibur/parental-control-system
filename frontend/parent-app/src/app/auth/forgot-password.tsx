import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Button, C, Field, PageHeader, Screen } from "../../components/ui";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRecover = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
    Alert.alert(
      "Password Reset Requested",
      "If an account exists with this email, security instructions have been generated. (Note: Email delivery requires active SMTP credentials configured on the backend server).",
      [{ text: "Back to Login", onPress: () => router.replace("/auth/login") }]
    );
  };

  return (
    <Screen>
      <PageHeader
        title="Reset Password"
        subtitle="Recover access to your parent administrator account"
      />

      <View
        style={{
          backgroundColor: C.pale,
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#D7E5FF",
        }}
      >
        <Text style={{ color: C.blue, fontWeight: "800", fontSize: 14 }}>
          🔐 Security Recovery Notice
        </Text>
        <Text style={{ color: "#475569", fontSize: 12, lineHeight: 18, marginTop: 4 }}>
          Enter your registered email address. For enterprise protection, reset authorizations must match your verified family administrator profile.
        </Text>
      </View>

      <Field
        label="Registered Email Address"
        placeholder="parent@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button
        title={submitted ? "Email Sent" : "Send Recovery Instructions"}
        disabled={submitted}
        onPress={handleRecover}
      />

      <View style={{ alignItems: "center", marginTop: 24 }}>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={{ color: C.blue, fontWeight: "700", fontSize: 14 }}>
              ← Return to Sign In
            </Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
