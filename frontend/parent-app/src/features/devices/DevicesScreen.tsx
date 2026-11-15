/**
 * ============================================================================
 * Feature: Devices - UI Component
 * ============================================================================
 * Visual presentation for Family Device Supervision & Enrollment.
 * Displays:
 * 1. Device enrollment section (One-tap 6-digit PIN, Copy button & QR code)
 * 2. Pure React Native QR Code rendering via toqr matrix
 * 3. Registered devices list with platform indicators & last-seen status
 * 4. Action buttons: Status toggle, Remote Lock/Unlock, and Unlink
 * 5. Quick links to Permissions, Screen Time, and DNS Policy
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { toQR } from "toqr";
import { C, PageHeader, Screen } from "../../components/ui";
import { useDevices } from "./useDevices";
import { devicesStyles } from "./devices.styles";
import { DeviceItem } from "./devices.service";

/**
 * Pure-RN QR Code renderer using the toqr 21×21 matrix
 */
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

export function DevicesScreen() {
  const {
    devices,
    loading,
    error,
    busyDeviceId,
    pairingCode,
    expiresAt,
    isGenerating,
    copied,
    loadDevices,
    createPairingCode,
    copyCode,
    changeStatus,
    sendRemoteCommand,
    unlinkDevice,
  } = useDevices();

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

      {/* ==================================================================== */}
      {/* 1. Device Enrollment Section */}
      {/* ==================================================================== */}
      <View style={devicesStyles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 20 }}>🔗</Text>
          <Text
            style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}
          >
            Enroll New Child Device
          </Text>
        </View>

        <Text
          style={{
            color: C.muted,
            fontSize: 12,
            lineHeight: 18,
            marginBottom: 14,
          }}
        >
          Tap the button below to generate a secure 6-digit pairing code and QR code. Use either to connect a child device.
        </Text>

        {!pairingCode && (
          <Pressable
            accessibilityRole="button"
            disabled={isGenerating}
            onPress={() => void createPairingCode()}
            style={[
              devicesStyles.generateButton,
              isGenerating && { opacity: 0.65 },
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator color={C.white} size="small" />
            ) : (
              <Text
                style={{ color: C.white, fontWeight: "800", fontSize: 14 }}
              >
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
          <View style={devicesStyles.pairingCodeBox}>
            <Text
              style={{
                color: C.muted,
                fontSize: 11,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Pairing Invitation Code (15-min expiry)
            </Text>

            {/* Code + Copy button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 12,
                gap: 14,
              }}
            >
              <Text selectable style={devicesStyles.pairingCodeText}>
                {pairingCode.slice(0, 3)} {pairingCode.slice(3)}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void copyCode()}
                style={[
                  devicesStyles.copyBtn,
                  copied && { backgroundColor: C.green },
                ]}
              >
                <Text
                  style={{ color: C.white, fontWeight: "800", fontSize: 13 }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </Text>
              </Pressable>
            </View>

            {!!expiresAt && (
              <Text
                style={{ color: C.muted, fontSize: 11, marginBottom: 14 }}
              >
                Valid until{" "}
                {new Date(expiresAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}

            {/* QR Code */}
            <Text
              style={{
                color: C.navy,
                fontWeight: "800",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              📷  Scan with Child App
            </Text>
            <View style={devicesStyles.qrWrapper}>
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
            <View style={devicesStyles.instructionsContainer}>
              <Text style={devicesStyles.instructionStep}>
                1. Open Child App on the child's phone.
              </Text>
              <Text style={devicesStyles.instructionStep}>
                2. Tap 'Connect to Parent' on login screen.
              </Text>
              <Text style={devicesStyles.instructionStep}>
                3. Enter the 6-digit code or scan the QR code.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* ==================================================================== */}
      {/* 2. Registered Devices Section */}
      {/* ==================================================================== */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text
          style={{ color: C.navy, fontSize: 17, fontWeight: "900" }}
        >
          Registered Devices ({devices.length})
        </Text>
        <Pressable onPress={() => void loadDevices()}>
          <Text style={{ color: C.blue, fontSize: 12, fontWeight: "700" }}>
            Refresh
          </Text>
        </Pressable>
      </View>

      {loading && (
        <ActivityIndicator color={C.blue} style={{ marginVertical: 20 }} />
      )}

      {!!error && (
        <View style={devicesStyles.errorBox}>
          <Text style={{ color: C.red, fontSize: 12, fontWeight: "700" }}>
            {error}
          </Text>
        </View>
      )}

      {!loading && !error && devices.length === 0 && (
        <View style={devicesStyles.emptyCard}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>📱</Text>
          <Text
            style={{ color: C.navy, fontWeight: "800", fontSize: 15 }}
          >
            No Devices Paired Yet
          </Text>
          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              textAlign: "center",
              marginTop: 4,
              lineHeight: 18,
            }}
          >
            Generate a pairing code above to connect your child's Android or iOS device to the Parental Control System.
          </Text>
        </View>
      )}

      {/* Device List */}
      {devices.map((item: DeviceItem) => {
        const badge = getStatusBadgeStyle(item.status);
        const isBusy = busyDeviceId === item.id;

        return (
          <View key={item.id} style={devicesStyles.deviceCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {item.platform === "IOS" ? "🍏" : "🤖"}
                  </Text>
                  <Text
                    style={{
                      color: C.navy,
                      fontWeight: "900",
                      fontSize: 16,
                    }}
                  >
                    {item.deviceName}
                  </Text>
                </View>

                <Text
                  style={{ color: C.muted, fontSize: 12, marginTop: 4 }}
                >
                  {item.platform}{" "}
                  {item.osVersion ? `• OS ${item.osVersion}` : ""}
                  {item.appVersion ? ` • App v${item.appVersion}` : ""}
                </Text>

                <Text
                  style={{ color: C.muted, fontSize: 11, marginTop: 2 }}
                >
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

              <View
                style={[
                  devicesStyles.statusBadge,
                  { backgroundColor: badge.bg },
                ]}
              >
                <Text
                  style={{
                    color: badge.text,
                    fontSize: 11,
                    fontWeight: "800",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={devicesStyles.actionRow}>
              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => void changeStatus(item)}
                style={[
                  devicesStyles.actionBtn,
                  {
                    backgroundColor:
                      item.status === "PAUSED" ? "#DCFCE7" : C.pale,
                  },
                ]}
              >
                <Text
                  style={{
                    color: item.status === "PAUSED" ? C.green : C.blue,
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {isBusy
                    ? "Saving..."
                    : item.status === "PAUSED"
                      ? "▶ Resume"
                      : "⏸ Pause"}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() =>
                  void sendRemoteCommand(
                    item,
                    item.status === "LOCKED" ? "RESUME" : "LOCK",
                  )
                }
                style={[
                  devicesStyles.actionBtn,
                  {
                    backgroundColor:
                      item.status === "LOCKED" ? C.pale : "#FEE2E2",
                  },
                ]}
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
                style={[
                  devicesStyles.actionBtn,
                  {
                    backgroundColor: "#F8FAFC",
                    borderWidth: 1,
                    borderColor: C.border,
                  },
                ]}
              >
                <Text
                  style={{ color: C.muted, fontWeight: "800", fontSize: 12 }}
                >
                  Unlink
                </Text>
              </Pressable>
            </View>

            {/* Quick Links to Policies */}
            <View style={devicesStyles.deviceLinks}>
              <Link href="/permissions" asChild>
                <Pressable style={devicesStyles.subLink}>
                  <Text style={devicesStyles.subLinkText}>Permissions ›</Text>
                </Pressable>
              </Link>
              <Link href="/screen-time" asChild>
                <Pressable style={devicesStyles.subLink}>
                  <Text style={devicesStyles.subLinkText}>Screen Time ›</Text>
                </Pressable>
              </Link>
              <Link href="/browser-policy" asChild>
                <Pressable style={devicesStyles.subLink}>
                  <Text style={devicesStyles.subLinkText}>DNS Policy ›</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

export default DevicesScreen;
