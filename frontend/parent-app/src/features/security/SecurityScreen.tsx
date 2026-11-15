/**
 * ============================================================================
 * Feature: Security - UI Component
 * ============================================================================
 * Visual presentation for Account Protection, 2FA Setup, and Security Audit Logs.
 * Displays:
 * 1. Security rating banner
 * 2. Multi-factor authentication activation with QR code & secret display
 * 3. Disable 2FA form
 * 4. Biometric App Lock toggle
 * 5. Recent security audit logs feed
 */

import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { useSecurity } from "./useSecurity";
import { securityStyles } from "./security.styles";
import { AuditLogEntry } from "./security.service";

export function SecurityScreen() {
  const {
    user,
    loading,
    busy,
    error,
    mfaEnabled,
    mfaQrCode,
    mfaSecret,
    verifyOtp,
    setVerifyOtp,
    disablePassword,
    setDisablePassword,
    disableOtp,
    setDisableOtp,
    showDisableForm,
    setShowDisableForm,
    biometricsEnabled,
    auditLogs,
    handleSetupMfa,
    handleEnableMfa,
    handleDisableMfa,
    toggleBiometrics,
  } = useSecurity();

  return (
    <Screen>
      <PageHeader
        title="Security Center"
        subtitle="Two-factor authentication, account protection & audit history"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />
        )}

        {!!error && (
          <View style={securityStyles.errorBox}>
            <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>
              {error}
            </Text>
          </View>
        )}

        {/* ==================================================================== */}
        {/* 1. Account Security Summary */}
        {/* ==================================================================== */}
        <View style={securityStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}>
            Account Security Rating
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <View
              style={[
                securityStyles.ratingPill,
                { backgroundColor: mfaEnabled ? "#DCFCE7" : "#FEF3C7" },
              ]}
            >
              <Text
                style={{
                  color: mfaEnabled ? C.green : C.orange,
                  fontWeight: "900",
                  fontSize: 13,
                }}
              >
                {mfaEnabled ? "EXCELLENT (2FA ON)" : "MODERATE (2FA OFF)"}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 8,
            }}
          >
            Administrator: {user?.email} • Status: {user?.status}
          </Text>
        </View>

        {/* ==================================================================== */}
        {/* 2. Multi-Factor Authentication Section */}
        {/* ==================================================================== */}
        <View style={securityStyles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.navy, fontSize: 15, fontWeight: "800" }}
              >
                Two-Factor Authentication (2FA)
              </Text>
              <Text
                style={{
                  color: mfaEnabled ? C.green : C.muted,
                  fontSize: 12,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                {mfaEnabled
                  ? "✓ Active (Google Authenticator / Authy)"
                  : "Not Enabled"}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 8,
            }}
          >
            Requires an authenticator app code every time you sign in from a new session.
          </Text>

          {!mfaEnabled && !mfaQrCode && (
            <Pressable
              disabled={busy}
              onPress={() => void handleSetupMfa()}
              style={securityStyles.primaryButton}
            >
              <Text style={securityStyles.primaryButtonText}>
                {busy ? "Preparing Secret..." : "Set Up Authenticator App"}
              </Text>
            </Pressable>
          )}

          {/* MFA Setup QR Code Display */}
          {!!mfaQrCode && (
            <View style={securityStyles.qrContainer}>
              <Text
                style={{
                  color: C.navy,
                  fontWeight: "800",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                1. Scan QR Code in Authenticator App:
              </Text>
              <Image
                source={{ uri: mfaQrCode }}
                style={{ width: 180, height: 180, borderRadius: 10 }}
              />
              <Text
                selectable
                style={{
                  color: C.navy,
                  fontSize: 12,
                  marginTop: 8,
                  fontWeight: "700",
                }}
              >
                Secret: {mfaSecret}
              </Text>

              <Text
                style={{
                  color: C.navy,
                  fontWeight: "800",
                  fontSize: 13,
                  marginTop: 14,
                  marginBottom: 6,
                }}
              >
                2. Enter 6-Digit Code to Confirm:
              </Text>
              <TextInput
                value={verifyOtp}
                onChangeText={setVerifyOtp}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                style={securityStyles.otpInput}
              />

              <Pressable
                disabled={busy}
                onPress={() => void handleEnableMfa()}
                style={securityStyles.confirmButton}
              >
                <Text
                  style={{ color: C.white, fontWeight: "800", fontSize: 13 }}
                >
                  {busy ? "Verifying..." : "Confirm & Enable 2FA"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Disable 2FA Section */}
          {mfaEnabled && !showDisableForm && (
            <Pressable
              onPress={() => setShowDisableForm(true)}
              style={securityStyles.secondaryButton}
            >
              <Text
                style={{ color: C.red, fontWeight: "800", fontSize: 13 }}
              >
                Disable Two-Factor Authentication
              </Text>
            </Pressable>
          )}

          {mfaEnabled && showDisableForm && (
            <View style={securityStyles.disableBox}>
              <Text
                style={{
                  color: C.red,
                  fontWeight: "800",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Confirm 2FA Deactivation:
              </Text>
              <TextInput
                value={disablePassword}
                onChangeText={setDisablePassword}
                placeholder="Your account password"
                secureTextEntry
                style={securityStyles.input}
              />
              <TextInput
                value={disableOtp}
                onChangeText={setDisableOtp}
                placeholder="Current 6-digit TOTP code"
                keyboardType="number-pad"
                maxLength={6}
                style={securityStyles.input}
              />
              <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                <Pressable
                  disabled={busy}
                  onPress={() => void handleDisableMfa()}
                  style={[
                    securityStyles.primaryButton,
                    { flex: 1, backgroundColor: C.red },
                  ]}
                >
                  <Text style={securityStyles.primaryButtonText}>
                    {busy ? "Disabling..." : "Confirm Disable"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowDisableForm(false)}
                  style={[
                    securityStyles.secondaryButton,
                    { flex: 1, marginTop: 14 },
                  ]}
                >
                  <Text
                    style={{
                      color: C.navy,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* ==================================================================== */}
        {/* 3. Biometric Lock Setting */}
        {/* ==================================================================== */}
        <View style={securityStyles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.navy, fontSize: 15, fontWeight: "800" }}
              >
                Biometric Protection
              </Text>
              <Text
                style={{ color: C.muted, fontSize: 12, marginTop: 2 }}
              >
                Use Touch ID, Face ID, or system biometrics on launch
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={(val) => void toggleBiometrics(val)}
              trackColor={{ false: "#CBD5E1", true: C.blue }}
              thumbColor={C.white}
            />
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 4. Security Audit Log Feed */}
        {/* ==================================================================== */}
        <View style={securityStyles.card}>
          <Text
            style={{
              color: C.navy,
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 10,
            }}
          >
            Recent Security & Audit Events
          </Text>

          {auditLogs.length === 0 && (
            <Text style={{ color: C.muted, fontSize: 12 }}>
              No administrative security events recorded.
            </Text>
          )}

          {auditLogs.map((log: AuditLogEntry) => (
            <View key={log.id} style={securityStyles.logRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: C.navy, fontWeight: "700", fontSize: 13 }}
                >
                  {log.action.replace(/_/g, " ")}
                </Text>
                <Text
                  style={{ color: C.muted, fontSize: 11, marginTop: 2 }}
                >
                  {new Date(log.createdAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {log.ipAddress ? ` • IP: ${log.ipAddress}` : ""}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: C.pale,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{ color: C.blue, fontSize: 10, fontWeight: "800" }}
                >
                  {log.entityType || "SECURITY"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

export default SecurityScreen;
