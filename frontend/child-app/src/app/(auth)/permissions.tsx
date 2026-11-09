
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PermissionsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.icon}>🔐</Text>

      <Text style={styles.title}>Permission Setup</Text>

      <Text style={styles.subtitle}>
        Set up the required permissions for ChildSafe.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
