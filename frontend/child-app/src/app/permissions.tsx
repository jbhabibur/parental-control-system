import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { ApiError, api } from "../lib/api";

const permissionItems = [
  {
    icon: "📱",
    title: "Applications",
    description: "Control access to installed applications.",
  },
  {
    icon: "📷",
    title: "Camera",
    description: "Access to camera requires parent approval.",
  },
  {
    icon: "🎙️",
    title: "Microphone",
    description: "Access to microphone requires parent approval.",
  },
  {
    icon: "📍",
    title: "Location",
    description: "Location access requires parent approval.",
  },
  {
    icon: "📶",
    title: "Mobile Data",
    description: "Control access to mobile data.",
  },
  {
    icon: "🔧",
    title: "Hardware Resources",
    description: "Only parent-approved hardware resources are accessible.",
  },
];

export default function PermissionsScreen() {
  const [requestType, setRequestType] = useState("HARDWARE_PERMISSION");
  const [resource, setResource] = useState("CAMERA");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      requestType: string;
      resource: string;
      reason?: string;
      status: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const result = await api.permissionRequests.mine();
      setRequests(
        Array.isArray(result.data) ? (result.data as typeof requests) : [],
      );
    } catch (error) {
      if (error instanceof ApiError)
        Alert.alert("Could not load requests", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const submitRequest = async () => {
    if (!resource.trim()) {
      Alert.alert(
        "Resource required",
        "Enter the app, domain, or hardware permission you need.",
      );
      return;
    }
    try {
      await api.permissionRequests.create({
        requestType,
        resource: resource.trim(),
        reason: reason.trim() || undefined,
      });
      setReason("");
      await loadRequests();
      Alert.alert("Request sent", "Your parent can now review the request.");
    } catch (error) {
      Alert.alert(
        "Could not send request",
        error instanceof ApiError
          ? error.message
          : "Pair this device and try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>

          <Text style={styles.logoText}>ChildSafe</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationIcon}>🔐</Text>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Permission Setup</Text>

        <Text style={styles.subtitle}>
          Your device access is controlled by your parent. Restricted resources
          require parent approval.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ask for access</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: 12,
            }}
          >
            {["HARDWARE_PERMISSION", "APPLICATION_ACCESS", "DOMAIN_ACCESS"].map(
              (type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setRequestType(type)}
                  style={{
                    borderWidth: 1,
                    borderColor: requestType === type ? "#2563EB" : "#E2E8F0",
                    backgroundColor:
                      requestType === type ? "#EFF6FF" : "#FFFFFF",
                    borderRadius: 9,
                    padding: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#1E293B",
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {type.replaceAll("_", " ")}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
          <TextInput
            value={resource}
            onChangeText={setResource}
            placeholder="CAMERA, app identifier, or domain"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 11,
              marginBottom: 9,
              color: "#1E293B",
            }}
          />
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Reason (optional)"
            multiline
            style={{
              minHeight: 65,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 10,
              padding: 11,
              marginBottom: 10,
              color: "#1E293B",
              textAlignVertical: "top",
            }}
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => void submitRequest}
          >
            <Text style={styles.continueButtonText}>
              Send permission request
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginTop: 14 }]}>
          <Text style={styles.cardTitle}>
            My requests {loading ? "· Loading" : `· ${requests.length}`}
          </Text>
          {requests.map((request) => (
            <View
              key={request.id}
              style={{
                paddingVertical: 11,
                borderTopWidth: 1,
                borderTopColor: "#E2E8F0",
              }}
            >
              <Text style={styles.itemTitle}>
                {request.resource} · {request.status}
              </Text>
              <Text style={styles.itemDescription}>
                {request.requestType.replaceAll("_", " ")}
                {request.reason ? ` · ${request.reason}` : ""}
              </Text>
            </View>
          ))}
          {!loading && requests.length === 0 && (
            <Text style={styles.itemDescription}>No requests yet.</Text>
          )}
        </View>

        {/* Permission Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Access Categories</Text>

          {permissionItems.map((item, index) => (
            <View key={item.title}>
              <View style={styles.permissionRow}>
                <View style={styles.itemIconContainer}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <Text style={styles.itemDescription}>{item.description}</Text>

                  <Text style={styles.status}>Parent approval required</Text>
                </View>
              </View>

              {index !== permissionItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Information Notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>ℹ️</Text>

          <Text style={styles.noticeText}>
            If you try to access a restricted application or resource, a
            permission request will be sent to your parent. Access is allowed
            only after approval.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={() => router.push("/monitoring-status")}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ChildSafe Parental Control</Text>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
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
    flexGrow: 1,
    padding: 24,
    paddingTop: 45,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 25,
    paddingVertical: 5,
  },

  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoCircle: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    fontSize: 29,
  },

  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E40AF",
    marginTop: 8,
  },

  illustration: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#DBEAFE",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  illustrationIcon: {
    fontSize: 43,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 9,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 15,
  },

  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  itemIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemIcon: {
    fontSize: 23,
  },

  itemInfo: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  itemDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    marginTop: 3,
  },

  status: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D97706",
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  notice: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 15,
    borderRadius: 13,
    marginTop: 20,
  },

  noticeIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  noticeText: {
    flex: 1,
    fontSize: 12,
    color: "#1E40AF",
    lineHeight: 19,
  },

  continueButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },

  footerText: {
    color: "#64748B",
    fontSize: 12,
  },

  version: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
});
