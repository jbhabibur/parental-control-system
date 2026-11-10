import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../components/ui";
import { ApiError, api } from "../lib/api";

type DeviceOption = { id: string; deviceName: string };
type LocationPoint = {
  id: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
};

export default function LocationScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [latest, setLatest] = useState<LocationPoint | null>(null);
  const [history, setHistory] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void api.devices
      .list()
      .then((result) => {
        const entries = Array.isArray(result.data)
          ? (result.data as DeviceOption[])
          : [];
        if (!active) return;
        setDevices(entries);
        setDeviceId(entries[0]?.id || "");
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load devices.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");
    void Promise.all([
      api.location.current(deviceId),
      api.location.history(deviceId),
    ])
      .then(([currentResult, historyResult]) => {
        if (!active) return;
        setLatest((currentResult.data as LocationPoint | null) || null);
        setHistory(
          Array.isArray(historyResult.data)
            ? (historyResult.data as LocationPoint[])
            : [],
        );
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load location history.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deviceId]);

  return (
    <Screen>
      <PageHeader
        title="Location"
        subtitle="Location points reported by the child device."
      />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red }}>
          {error}
        </Text>
      )}
      {devices.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => setDeviceId(item.id)}
          style={{
            borderWidth: 1,
            borderColor: item.id === deviceId ? C.blue : C.border,
            backgroundColor: item.id === deviceId ? C.pale : C.white,
            borderRadius: 10,
            padding: 12,
            marginBottom: 7,
          }}
        >
          <Text style={{ color: C.navy, fontWeight: "800" }}>
            {item.deviceName}
          </Text>
        </Pressable>
      ))}
      {latest && (
        <View
          style={{
            backgroundColor: C.navy,
            borderRadius: 13,
            padding: 15,
            marginTop: 10,
            marginBottom: 18,
          }}
        >
          <Text style={{ color: C.white, fontWeight: "900" }}>
            Latest point
          </Text>
          <Text selectable style={{ color: C.white, marginTop: 8 }}>
            {latest.latitude}, {latest.longitude}
          </Text>
          <Text style={{ color: "#C5D2E8", fontSize: 11, marginTop: 6 }}>
            {new Date(latest.capturedAt).toLocaleString()}
          </Text>
        </View>
      )}
      {!loading && devices.length === 0 && (
        <Text style={{ color: C.muted }}>
          Connect a child device to view reported locations.
        </Text>
      )}
      {!loading && deviceId && !latest && (
        <Text style={{ color: C.muted, marginTop: 10 }}>
          No location has been reported for this device.
        </Text>
      )}
      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        History ({history.length})
      </Text>
      {history.map((point) => (
        <View
          key={point.id}
          style={{
            paddingVertical: 11,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <Text selectable style={{ color: C.text, fontWeight: "700" }}>
            {point.latitude}, {point.longitude}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            {new Date(point.capturedAt).toLocaleString()}
          </Text>
        </View>
      ))}
      <Text
        style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 15 }}
      >
        The backend only returns location data previously reported by a child
        client. This app does not collect GPS data itself.
      </Text>
    </Screen>
  );
}
