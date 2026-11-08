import React, { useState } from "react";
import { Text, View, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Screen, PageHeader, Field, Button, C } from "../../components/ui";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = () => {
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
    Alert.alert("UI preview", "Your form is valid. Account creation will work after backend integration.", [
      { text: "Back to sign in", onPress: () => router.replace("/auth/login") }
    ]);
  };

  return (
    <Screen>
      <PageHeader title="Create account" subtitle="Set up your parent account" />
      <View style={{ backgroundColor: C.pale, padding: 17, borderRadius: 16, marginBottom: 22 }}>
        <Text style={{ color: C.blue, fontWeight: "800", fontSize: 15 }}>Parent Control</Text>
        <Text style={{ color: "#52647F", fontSize: 12, lineHeight: 18, marginTop: 5 }}>Create an account to manage connected child devices and family safety settings.</Text>
      </View>
      <Field label="Full name" placeholder="Enter your full name" value={name} onChangeText={setName} />
      <Field label="Email address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Field label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry />
      <Field label="Confirm password" placeholder="Re-enter your password" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <Button title="Create account" onPress={submit} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
        <Text style={{ color: C.muted }}>Already have an account? </Text>
        <Link href="/auth/login" asChild><Pressable><Text style={{ color: C.blue, fontWeight: "800" }}>Sign in</Text></Pressable></Link>
      </View>
    </Screen>
  );
}
