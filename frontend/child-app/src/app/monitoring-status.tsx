import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { ApiError, api, clearTokens, getRefreshToken } from "../lib/api";

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
  const [lastHeartbeat, setLastHeartbeat] = useState("");
  const [commands, setCommands] = useState<
    Array<{ id: string; commandType: string; status: string }>
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      try {
        await api.pairing.heartbeat();
        const result = await api.commands.pending();
        if (!active) return;
        setLastHeartbeat(new Date().toLocaleTimeString());
        setCommands(
          Array.isArray(result.data) ? (result.data as typeof commands) : [],
        );
        setError("");
      } catch (requestError) {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to contact the backend.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void sync();
    const interval = setInterval(() => {
      void sync();
    }, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const signOut = async () => {
    try {
      const refreshToken = await getRefreshToken("device");
      if (refreshToken) await api.pairing.logout(refreshToken);
    } catch {
      setError(
        "Could not reach the server; local device credentials were cleared.",
      );
    } finally {
      await clearTokens("device");
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🛡️ ChildSafe</Text>

        <Text style={styles.title}>Monitoring Status</Text>

        <Text style={styles.subtitle}>
          Device connection and queued commands.
        </Text>

        {loading && <ActivityIndicator color="#2563EB" />}
        {!!error && (
          <Text
            accessibilityRole="alert"
            style={{ color: "#B42318", marginBottom: 14 }}
          >
            {error}
          </Text>
        )}

        {monitoringItems.map((item) => (
          <View style={styles.card} key={item.title}>
            <Text style={styles.icon}>{item.icon}</Text>

            <View style={styles.info}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.status}>
                {lastHeartbeat
                  ? `Connected · checked ${lastHeartbeat}`
                  : "Waiting for heartbeat"}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            The backend records heartbeat and queued commands. App-usage,
            location, browser collection, and operating-system enforcement
            require platform-specific services that are not present in this app
            yet.
          </Text>
        </View>
        <Text
          style={{
            color: "#1E293B",
            fontSize: 17,
            fontWeight: "800",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Pending commands ({commands.length})
        </Text>
        {commands.map((command) => (
          <View key={command.id} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.itemTitle}>
                {command.commandType.replaceAll("_", " ")}
              </Text>
              <Text style={styles.description}>Status: {command.status}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/permissions")}
        >
          <Text style={[styles.buttonText, { color: "#2563EB" }]}>
            Permission requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => void signOut()}>
          <Text style={styles.buttonText}>Disconnect device</Text>
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
