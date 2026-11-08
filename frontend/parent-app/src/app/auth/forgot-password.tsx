import React, { useState } from "react";
import { Alert, Text } from "react-native";
import { Screen, PageHeader, Field, Button } from "../../components/ui";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  return (
    <Screen>
      <PageHeader title="Forgot password" subtitle="Recover access to your parent account" />
      <Text style={{ color: "#718096", fontSize: 14, lineHeight: 22, marginBottom: 25 }}>Enter the email address associated with your account. Password recovery will be connected to the backend later.</Text>
      <Field label="Email address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Button title="Send recovery link" onPress={() => {
        if (!/^\S+@\S+\.\S+$/.test(email)) Alert.alert("Invalid email", "Enter a valid email address.");
        else Alert.alert("UI preview", "Recovery email sending will be enabled after backend integration.");
      }} />
    </Screen>
  );
}
