import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type DeviceItem = {
  id: string;
  childId: string;
  deviceName: string;
  platform: string;
  osVersion?: string | null;
  status: string;
  lastSeenAt?: string | null;
};

export default function DevicesScreen() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [childId, setChildId] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyDeviceId, setBusyDeviceId] = useState("");
  const [error, setError] = useState("");

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
          : "Unable to load devices.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDevices();
  }, []);

  const createPairingCode = async () => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        childId.trim(),
      )
    ) {
      Alert.alert(
        "Child ID required",
        "Enter the UUID of a CHILD account already linked to this parent.",
      );
      return;
    }
    try {
      const result = await api.pairing.generate(childId.trim());
      const data = result.data as
        | { pairingCode?: string; expiresAt?: string }
        | undefined;
      if (!data?.pairingCode)
        throw new Error("The server did not return a pairing code.");
      setPairingCode(data.pairingCode);
      setExpiresAt(data.expiresAt || "");
    } catch (requestError) {
      Alert.alert(
        "Could not generate code",
        requestError instanceof ApiError
          ? requestError.message
          : "Check that the child account exists and belongs to you.",
      );
    }
  };

  const changeStatus = async (item: DeviceItem) => {
    const status = item.status === "PAUSED" ? "ACTIVE" : "PAUSED";
    setBusyDeviceId(item.id);
    try {
      await api.devices.setStatus(item.id, status);
      await loadDevices();
    } catch (requestError) {
      Alert.alert(
        "Could not update device",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setBusyDeviceId("");
    }
  };

  const sendCommand = async (
    item: DeviceItem,
    commandType: "LOCK" | "UNLOCK",
  ) => {
    setBusyDeviceId(item.id);
    try {
      await api.commands.create(item.id, { commandType });
      Alert.alert(
        "Command queued",
        `${commandType} was queued for ${item.deviceName}. The child app must be online to receive it.`,
      );
    } catch (requestError) {
      Alert.alert(
        "Could not queue command",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setBusyDeviceId("");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Child devices"
        subtitle="Live device records and pairing controls."
      />
      <View
        style={{
          backgroundColor: C.white,
          borderColor: C.border,
          borderWidth: 1,
          borderRadius: 14,
          padding: 15,
          marginBottom: 18,
        }}
      >
        <Text
          style={{
            color: C.navy,
            fontSize: 15,
            fontWeight: "900",
            marginBottom: 7,
          }}
        >
          Generate pairing code
        </Text>
        <Text
          style={{
            color: C.muted,
            fontSize: 12,
            lineHeight: 18,
            marginBottom: 12,
          }}
        >
          Requires the UUID of a CHILD account already connected to this parent.
        </Text>
        <TextInput
          value={childId}
          onChangeText={setChildId}
          placeholder="Child account UUID"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            minHeight: 46,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 10,
            paddingHorizontal: 12,
            color: C.text,
            marginBottom: 10,
          }}
        />
        <Pressable
          accessibilityRole="button"
          onPress={createPairingCode}
          style={{
            minHeight: 44,
            borderRadius: 10,
            backgroundColor: C.blue,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: C.white, fontWeight: "800" }}>
            Generate code
          </Text>
        </Pressable>
        {!!pairingCode && (
          <Text
            selectable
            style={{
              color: C.navy,
              fontSize: 25,
              fontWeight: "900",
              letterSpacing: 4,
              marginTop: 13,
            }}
          >
            {pairingCode}
          </Text>
        )}
        {!!expiresAt && (
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            Expires {new Date(expiresAt).toLocaleString()}
          </Text>
        )}
      </View>

      {loading ? <ActivityIndicator color={C.blue} /> : null}
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, fontSize: 12, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}
      {!loading && !error && devices.length === 0 && (
        <Text style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>
          No child devices are connected yet.
        </Text>
      )}
      {devices.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: C.white,
            borderColor: C.border,
            borderWidth: 1,
            borderRadius: 15,
            padding: 15,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: C.navy, fontWeight: "900", fontSize: 16 }}>
            {item.deviceName}
          </Text>
          <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
            {item.platform}
            {item.osVersion ? ` · ${item.osVersion}` : ""} · {item.status}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            Last seen:{" "}
            {item.lastSeenAt
              ? new Date(item.lastSeenAt).toLocaleString()
              : "Not reported"}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 13 }}>
            <Pressable
              accessibilityRole="button"
              disabled={busyDeviceId === item.id}
              onPress={() => void changeStatus(item)}
              style={{
                flex: 1,
                minHeight: 42,
                borderRadius: 10,
                backgroundColor: C.pale,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.blue, fontWeight: "800", fontSize: 12 }}>
                {busyDeviceId === item.id
                  ? "Saving..."
                  : item.status === "PAUSED"
                    ? "Resume"
                    : "Pause"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={busyDeviceId === item.id}
              onPress={() => void sendCommand(item, "LOCK")}
              style={{
                flex: 1,
                minHeight: 42,
                borderRadius: 10,
                backgroundColor: "#FFF1F0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.red, fontWeight: "800", fontSize: 12 }}>
                Queue lock
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Link href="/permissions" asChild>
        <Pressable
          accessibilityRole="button"
          style={{
            backgroundColor: "#EFF4FB",
            borderRadius: 14,
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}>
              Permission requests
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              Review requests from your child
            </Text>
          </View>
          <Text style={{ color: C.blue, fontWeight: "900", fontSize: 20 }}>
            ›
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
