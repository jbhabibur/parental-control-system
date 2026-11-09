
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const monitoringItems = [
  {
    icon: "📱",
    title: "App Usage Monitoring",
    description: "Application usage activity monitoring.",
  },
  {
    icon: "⏱️",
    title: "Screen Time Monitoring",
    description: "Device screen time monitoring.",
  },
  {
    icon: "📍",
    title: "Location Monitoring",
    description: "Device location monitoring.",
  },
];

export default function MonitoringStatusScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🛡️ ChildSafe</Text>

        <Text style={styles.title}>Monitoring Status</Text>

        <Text style={styles.subtitle}>
          Check your device monitoring status.
        </Text>

        {monitoringItems.map((item) => (
          <View style={styles.card} key={item.title}>
            <Text style={styles.icon}>{item.icon}</Text>

            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.description}>
                {item.description}
              </Text>
              <Text style={styles.status}>Not Active</Text>
            </View>
          </View>
        ))}

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Demo screen: Actual device monitoring is not
            implemented yet.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 24,
    paddingTop: 55,
    flexGrow: 1,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 35,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  description: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  status: {
    fontSize: 12,
    color: "#D97706",
    fontWeight: "700",
    marginTop: 8,
  },
  notice: {
    backgroundColor: "#FEF3C7",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  noticeText: {
    color: "#92400E",
    fontSize: 12,
    lineHeight: 19,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
