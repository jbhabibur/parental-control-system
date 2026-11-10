import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.subtitle}>Parent Control System</Text>

      <View style={styles.card}>
        <Text style={styles.success}>Dashboard Loaded Successfully!</Text>

        <Text style={styles.description}>
          Expo Router is working correctly.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/auth/login")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#172B4D",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
    elevation: 3,
  },

  success: {
    fontSize: 17,
    fontWeight: "800",
    color: "#16A34A",
    textAlign: "center",
  },

  description: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
