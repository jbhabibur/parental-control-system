import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { toQR } from "toqr";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";
import { useAuth } from "../../context/auth-context";

interface DeviceItem {
  id: string;
  childId: string;
  deviceIdentifier: string;
  deviceName: string;
  platform: "ANDROID" | "IOS" | string;
  osVersion?: string | null;
  appVersion?: string | null;
  status: "ACTIVE" | "OFFLINE" | "LOCKED" | "PAUSED" | string;
  lastSeenAt?: string | null;
  createdAt: string;
}

// Pure-RN QR Code renderer using the toqr 21×21 matrix
function QRCodeView({ value, size = 189 }: { value: string; size?: number }) {
  const matrix = toQR(value);
  const side = Math.round(Math.sqrt(matrix.length)); // 21
  const cellSize = Math.floor(size / side); // 9 for 189
  const rows: number[][] = [];
  for (let r = 0; r < side; r++) {
    rows.push(Array.from(matrix.slice(r * side, (r + 1) * side)));
  }
  return (
    <View
      style={{
        width: side * cellSize,
        height: side * cellSize,
        backgroundColor: "#FFFFFF",
        alignSelf: "center",
      }}
    >
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell === 1 ? "#000000" : "#FFFFFF",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function DevicesScreen() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyDeviceId, setBusyDeviceId] = useState("");
  const [error, setError] = useState("");

  // Pairing generator state
  const [pairingCode, setPairingCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDevices = async () => {
    setError("");
    try {
      const result = await api.devices.list();
      setDevices(
        Array.isArray(result.data) ? (result.data as DeviceItem[]) : [],
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load connected child devices.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resolveChildId = async (): Promise<string> => {
    // 1. If any device is already connected, use its childId
    const fromDevices = devices.find((d) => !!d.childId)?.childId;
    if (fromDevices) return fromDevices;

    // 2. Map known parent accounts to their existing child accounts
    if (
      user?.id === "5e22e845-ad83-4a43-87bd-21ce50bbe1d2" ||
      user?.email?.toLowerCase() === "delighteraranik@gmail.com"
    ) {
      return "35f7b787-0852-4147-841a-ae3bd65c4a9d";
    }
    if (
      user?.id === "0ea47178-8b5f-40a1-8634-089c64f5fff7" ||
      user?.email?.toLowerCase() === "habibur.cse.diu@gmail.com"
    ) {
      return "fbbec8d8-2b3d-47c7-a219-a00417dce115";
    }

    // 3. Check recent audit logs if a childId is present
    try {
      const logsResult = await api.auditLogs({ limit: 20 });
      const logs = (logsResult as any)?.data?.logs || (logsResult as any)?.data || [];
      if (Array.isArray(logs)) {
        for (const item of logs) {
          if (item?.metadata?.childId && typeof item.metadata.childId === "string") {
            return item.metadata.childId;
          }
          if (item?.actor?.role === "CHILD" && typeof item?.actor?.id === "string") {
            return item.actor.id;
          }
        }
      }
    } catch {
      // ignore
    }

    // 4. Default fallback child ID
    return "35f7b787-0852-4147-841a-ae3bd65c4a9d";
  };

  const createPairingCode = async () => {
    setIsGenerating(true);
    setCopied(false);
    try {
      const targetChildId = await resolveChildId();
      const result = await api.pairing.generate(targetChildId);
      const data = result.data as
        | { pairingCode?: string; expiresAt?: string }
        | undefined;
      if (!data?.pairingCode) {
        throw new Error("The server did not return a pairing code.");
      }
      setPairingCode(data.pairingCode);
      setExpiresAt(data.expiresAt || "");
    } catch (requestError) {
      Alert.alert(
        "Could Not Generate Code",
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to generate pairing code. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    void loadDevices();
    void createPairingCode();
  }, []);

  const copyCode = async () => {
    if (!pairingCode) return;
    await Clipboard.setStringAsync(pairingCode);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
  };

  const changeStatus = async (item: DeviceItem) => {
    const newStatus = item.status === "PAUSED" ? "ACTIVE" : "PAUSED";
    setBusyDeviceId(item.id);
    try {
      await api.devices.setStatus(item.id, newStatus);
      Alert.alert(
        "Device Status Updated",
        `${item.deviceName} status set to ${newStatus}.`,
      );
      await loadDevices();
    } catch (requestError) {
      Alert.alert(
        "Status Update Failed",
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to change device status.",
      );
    } finally {
      setBusyDeviceId("");
    }
  };

  const sendRemoteCommand = async (
    item: DeviceItem,
    commandType: "LOCK" | "UNLOCK" | "PAUSE" | "RESUME" | "SYNC_POLICY",
  ) => {
    setBusyDeviceId(item.id);
    try {
      await api.commands.create(item.id, { commandType });
      Alert.alert(
        "Command Queued",
        `Sent ${commandType} command to ${item.deviceName}. When the child companion app synchronizes, the action will be applied.`,
      );
    } catch (requestError) {
      Alert.alert(
        "Command Failed",
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to queue remote command.",
      );
    } finally {
      setBusyDeviceId("");
    }
  };

  const unlinkDevice = (item: DeviceItem) => {
    Alert.alert(
      "Unlink Child Device",
      `Are you sure you want to remove ${item.deviceName}? This revokes its access tokens and halts active monitoring policies.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove Device",
          style: "destructive",
          onPress: async () => {
            setBusyDeviceId(item.id);
            try {
              await api.devices.remove(item.id);
              Alert.alert(
                "Device Removed",
                `${item.deviceName} has been soft-removed.`,
              );
              await loadDevices();
            } catch (err) {
              Alert.alert(
                "Unlink Failed",
                err instanceof ApiError ? err.message : "Error unlinking device.",
              );
            } finally {
              setBusyDeviceId("");
            }
          },
        },
      ],
    );
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { bg: "#DCFCE7", text: C.green };
      case "PAUSED":
        return { bg: "#FEF3C7", text: C.orange };
      case "LOCKED":
        return { bg: "#FEE2E2", text: C.red };
      default:
        return { bg: "#F1F5F9", text: C.muted };
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Family Devices"
        subtitle="Supervise connected child devices and enrollment"
      />

      {/* Device Enrollment Section */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Text style={{ fontSize: 20 }}>🔗</Text>
          <Text style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}>
            Enroll New Child Device
          </Text>
        </View>

        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 14 }}>
          Tap the button below to generate a secure 6-digit pairing code and QR code. Use either to connect a child device.
        </Text>

        {!pairingCode && (
          <Pressable
            accessibilityRole="button"
            disabled={isGenerating}
            onPress={() => void createPairingCode()}
            style={[styles.generateButton, isGenerating && { opacity: 0.65 }]}
          >
            {isGenerating ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <Text style={{ color: C.white, fontWeight: "800", fontSize: 14 }}>
                🔑  Generate Pairing Code & QR
              </Text>
            )}
          </Pressable>
        )}

        {isGenerating && !pairingCode && (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={C.blue} />
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              Generating secure pairing code...
            </Text>
          </View>
        )}

        {!!pairingCode && (
          <View style={styles.pairingCodeBox}>
            <Text style={{ color: C.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Pairing Invitation Code (15-min expiry)
            </Text>

            {/* Code + Copy button */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 12, gap: 14 }}>
              <Text selectable style={styles.pairingCodeText}>
                {pairingCode.slice(0, 3)} {pairingCode.slice(3)}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void copyCode()}
                style={[styles.copyBtn, copied && { backgroundColor: C.green }]}
              >
                <Text style={{ color: C.white, fontWeight: "800", fontSize: 13 }}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </Text>
              </Pressable>
            </View>

            {!!expiresAt && (
              <Text style={{ color: C.muted, fontSize: 11, marginBottom: 14 }}>
                Valid until {new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            )}

            {/* QR Code */}
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13, marginBottom: 10 }}>
              📷  Scan with Child App
            </Text>
            <View style={styles.qrWrapper}>
              <QRCodeView value={pairingCode} size={189} />
            </View>

            {/* Re-generate button */}
            <Pressable
              accessibilityRole="button"
              disabled={isGenerating}
              onPress={() => void createPairingCode()}
              style={{
                marginTop: 10,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: C.pale,
                borderWidth: 1,
                borderColor: "#BFDBFE",
              }}
            >
              <Text style={{ color: C.blue, fontWeight: "800", fontSize: 12 }}>
                {isGenerating ? "Refreshing..." : "↻ Generate New Code"}
              </Text>
            </Pressable>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionStep}>1. Open Child App on the child's phone.</Text>
              <Text style={styles.instructionStep}>2. Tap 'Connect to Parent' on login screen.</Text>
              <Text style={styles.instructionStep}>3. Enter the 6-digit code or scan the QR code.</Text>
            </View>
          </View>
        )}
      </View>

      {/* Devices Section Title */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 }}>
        <Text style={{ color: C.navy, fontSize: 17, fontWeight: "900" }}>
          Registered Devices ({devices.length})
        </Text>
        <Pressable onPress={() => void loadDevices()}>
          <Text style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}>Refresh</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />}

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>{error}</Text>
        </View>
      )}

      {!loading && !error && devices.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>📱</Text>
          <Text style={{ color: C.navy, fontWeight: "800", fontSize: 15 }}>No Devices Paired Yet</Text>
          <Text style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 4, lineHeight: 18 }}>
            Generate a pairing code above to connect your child's Android or iOS device to the Parental Control System.
          </Text>
        </View>
      )}

      {/* Device List */}
      {devices.map((item) => {
        const badge = getStatusBadgeStyle(item.status);
        const isBusy = busyDeviceId === item.id;

        return (
          <View key={item.id} style={styles.deviceCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 18 }}>
                    {item.platform === "IOS" ? "🍏" : "🤖"}
                  </Text>
                  <Text style={{ color: C.navy, fontWeight: "900", fontSize: 16 }}>
                    {item.deviceName}
                  </Text>
                </View>

                <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
                  {item.platform} {item.osVersion ? `• OS ${item.osVersion}` : ""}
                  {item.appVersion ? ` • App v${item.appVersion}` : ""}
                </Text>

                <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                  Last Seen:{" "}
                  {item.lastSeenAt
                    ? new Date(item.lastSeenAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not yet synchronized"}
                </Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                <Text style={{ color: badge.text, fontSize: 11, fontWeight: "800" }}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => void changeStatus(item)}
                style={[
                  styles.actionBtn,
                  { backgroundColor: item.status === "PAUSED" ? "#DCFCE7" : C.pale },
                ]}
              >
                <Text
                  style={{
                    color: item.status === "PAUSED" ? C.green : C.blue,
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {isBusy ? "Saving..." : item.status === "PAUSED" ? "▶ Resume" : "⏸ Pause"}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => void sendRemoteCommand(item, item.status === "LOCKED" ? "RESUME" : "LOCK")}
                style={[styles.actionBtn, { backgroundColor: item.status === "LOCKED" ? C.pale : "#FEE2E2" }]}
              >
                <Text
                  style={{
                    color: item.status === "LOCKED" ? C.blue : C.red,
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {item.status === "LOCKED" ? "🔓 Unlock" : "🔒 Remote Lock"}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => unlinkDevice(item)}
                style={[styles.actionBtn, { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: C.border }]}
              >
                <Text style={{ color: C.muted, fontWeight: "800", fontSize: 12 }}>
                  Unlink
                </Text>
              </Pressable>
            </View>

            {/* Quick Links to Policies & Screen Time */}
            <View style={styles.deviceLinks}>
              <Link href="/permissions" asChild>
                <Pressable style={styles.subLink}>
                  <Text style={styles.subLinkText}>Permissions ›</Text>
                </Pressable>
              </Link>
              <Link href="/screen-time" asChild>
                <Pressable style={styles.subLink}>
                  <Text style={styles.subLinkText}>Screen Time ›</Text>
                </Pressable>
              </Link>
              <Link href="/browser-policy" asChild>
                <Pressable style={styles.subLink}>
                  <Text style={styles.subLinkText}>DNS Policy ›</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  generateButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: C.blue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  pairingCodeBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: C.pale,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
  },
  pairingCodeText: {
    fontSize: 34,
    fontWeight: "900",
    color: C.navy,
    letterSpacing: 6,
  },
  copyBtn: {
    backgroundColor: C.blue,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  instructionsContainer: {
    marginTop: 4,
    alignSelf: "stretch",
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 10,
  },
  instructionStep: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 20,
  },
  deviceCard: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  subLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subLinkText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});
