import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api, getStored, setStored } from "../../lib/api";
import { useAuth } from "../../context/auth-context";

interface AuditLogEntry {
  id: string;
  action: string;
  entityType?: string;
  ipAddress?: string | null;
  createdAt: string;
}

export default function SecurityCenterScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableOtp, setDisableOtp] = useState("");
  const [showDisableForm, setShowDisableForm] = useState(false);

  // Biometric preference
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const loadSecurityState = async () => {
    setError("");
    try {
      const [mfaStatusRes, logsRes, bioPref] = await Promise.all([
        api.mfa.status().catch(() => ({ data: { enabled: false } })),
        api.auditLogs({ limit: 8 }).catch(() => ({ data: { logs: [] } })),
        getStored("parent-control.pref.biometric"),
      ]);

      const statusData = mfaStatusRes.data as { enabled?: boolean } | undefined;
      setMfaEnabled(Boolean(statusData?.enabled));

      const logsData = logsRes.data as { logs?: AuditLogEntry[] } | undefined;
      setAuditLogs(Array.isArray(logsData?.logs) ? logsData!.logs! : []);

      setBiometricsEnabled(bioPref === "true");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to load security profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSecurityState();
  }, []);

  const handleSetupMfa = async () => {
    setBusy(true);
    try {
      const res = await api.mfa.setup();
      const setupData = res.data as { qrCode?: string; secret?: string } | undefined;
      setMfaQrCode(setupData?.qrCode || "");
      setMfaSecret(setupData?.secret || "");
    } catch (err) {
      Alert.alert(
        "MFA Setup Failed",
        err instanceof ApiError ? err.message : "Could not initiate MFA setup.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEnableMfa = async () => {
    const cleanOtp = verifyOtp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit confirmation code.");
      return;
    }

    setBusy(true);
    try {
      await api.mfa.enable(cleanOtp);
      Alert.alert("Success", "Two-factor authentication is now active on your account.");
      setMfaEnabled(true);
      setMfaQrCode("");
      setMfaSecret("");
      setVerifyOtp("");
      await loadSecurityState();
    } catch (err) {
      Alert.alert(
        "Verification Failed",
        err instanceof ApiError ? err.message : "Invalid code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!disablePassword || !disableOtp) {
      Alert.alert("Missing Information", "Enter your password and current 6-digit code.");
      return;
    }

    setBusy(true);
    try {
      await api.mfa.disable(disablePassword, disableOtp.trim());
      Alert.alert("MFA Disabled", "Two-factor authentication has been removed.");
      setMfaEnabled(false);
      setShowDisableForm(false);
      setDisablePassword("");
      setDisableOtp("");
      await loadSecurityState();
    } catch (err) {
      Alert.alert(
        "Could Not Disable MFA",
        err instanceof ApiError ? err.message : "Verification failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const toggleBiometrics = async (val: boolean) => {
    setBiometricsEnabled(val);
    await setStored("parent-control.pref.biometric", val ? "true" : "false");
  };

  return (
    <Screen>
      <PageHeader
        title="Security Center"
        subtitle="Two-factor authentication, account protection & audit history"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

        {!!error && (
          <View style={sStyles.errorBox}>
            <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>{error}</Text>
          </View>
        )}

        {/* Account Security Summary */}
        <View style={sStyles.card}>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}>
            Account Security Rating
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
            <View
              style={[
                sStyles.ratingPill,
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
          <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 8 }}>
            Administrator: {user?.email} • Status: {user?.status}
          </Text>
        </View>

        {/* Multi-Factor Authentication Section */}
        <View style={sStyles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.navy, fontSize: 15, fontWeight: "800" }}>
                Two-Factor Authentication (2FA)
              </Text>
              <Text style={{ color: mfaEnabled ? C.green : C.muted, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {mfaEnabled ? "✓ Active (Google Authenticator / Authy)" : "Not Enabled"}
              </Text>
            </View>
          </View>

          <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 8 }}>
            Requires an authenticator app code every time you sign in from a new session.
          </Text>

          {!mfaEnabled && !mfaQrCode && (
            <Pressable
              disabled={busy}
              onPress={() => void handleSetupMfa()}
              style={sStyles.primaryButton}
            >
              <Text style={sStyles.primaryButtonText}>
                {busy ? "Preparing Secret..." : "Set Up Authenticator App"}
              </Text>
            </Pressable>
          )}

          {/* MFA Setup QR Code Display */}
          {!!mfaQrCode && (
            <View style={sStyles.qrContainer}>
              <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13, marginBottom: 8 }}>
                1. Scan QR Code in Authenticator App:
              </Text>
              <Image source={{ uri: mfaQrCode }} style={{ width: 180, height: 180, borderRadius: 10 }} />
              <Text selectable style={{ color: C.navy, fontSize: 12, marginTop: 8, fontWeight: "700" }}>
                Secret: {mfaSecret}
              </Text>

              <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13, marginTop: 14, marginBottom: 6 }}>
                2. Enter 6-Digit Code to Confirm:
              </Text>
              <TextInput
                value={verifyOtp}
                onChangeText={setVerifyOtp}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                style={sStyles.otpInput}
              />

              <Pressable
                disabled={busy}
                onPress={() => void handleEnableMfa()}
                style={sStyles.confirmButton}
              >
                <Text style={{ color: C.white, fontWeight: "800", fontSize: 13 }}>
                  {busy ? "Verifying..." : "Confirm & Enable 2FA"}
                </Text>
              </Pressable>
            </View>
          )}

          {mfaEnabled && !showDisableForm && (
            <Pressable
              onPress={() => setShowDisableForm(true)}
              style={sStyles.secondaryButton}
            >
              <Text style={{ color: C.red, fontWeight: "800", fontSize: 13 }}>
                Disable Two-Factor Auth
              </Text>
            </Pressable>
          )}

          {mfaEnabled && showDisableForm && (
            <View style={sStyles.disableBox}>
              <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13, marginBottom: 6 }}>
                Disable 2FA Verification:
              </Text>
              <TextInput
                value={disablePassword}
                onChangeText={setDisablePassword}
                placeholder="Account password"
                secureTextEntry
                style={sStyles.input}
              />
              <TextInput
                value={disableOtp}
                onChangeText={setDisableOtp}
                placeholder="Current 6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
                style={sStyles.input}
              />
              <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                <Pressable
                  disabled={busy}
                  onPress={() => void handleDisableMfa()}
                  style={[sStyles.confirmButton, { backgroundColor: C.red, flex: 1 }]}
                >
                  <Text style={{ color: C.white, fontWeight: "800" }}>Confirm Disable</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowDisableForm(false)}
                  style={[sStyles.secondaryButton, { flex: 1, marginTop: 0 }]}
                >
                  <Text style={{ color: C.muted, fontWeight: "700" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Biometric Preferences */}
        <View style={sStyles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.navy, fontSize: 15, fontWeight: "800" }}>
                Biometric App Unlock
              </Text>
              <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                Use Fingerprint or Face ID when launching the parent app
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

        {/* Audit Logs Viewer */}
        <View style={sStyles.card}>
          <Text style={{ color: C.navy, fontSize: 15, fontWeight: "800", marginBottom: 10 }}>
            Recent Security Audit History
          </Text>

          {auditLogs.length === 0 && (
            <Text style={{ color: C.muted, fontSize: 12 }}>
              No audit records registered yet.
            </Text>
          )}

          {auditLogs.map((log) => (
            <View key={log.id} style={sStyles.logRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}>
                  {log.action.replace(/_/g, " ")}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                  IP: {log.ipAddress || "Internal"} • {new Date(log.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              <Text style={{ color: C.green, fontSize: 11, fontWeight: "800" }}>
                VERIFIED
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const sStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: C.blue,
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primaryButtonText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  confirmButton: {
    backgroundColor: C.green,
    borderRadius: 10,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  qrContainer: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  otpInput: {
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    backgroundColor: C.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    color: C.text,
    fontSize: 13,
    marginBottom: 8,
  },
  disableBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});

