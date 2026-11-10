import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type AlertItem = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  severity?: string;
  createdAt: string;
  acknowledgedAt?: string | null;
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    setError("");
    try {
      const result = await api.alerts.list();
      setAlerts(Array.isArray(result.data) ? (result.data as AlertItem[]) : []);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load alerts.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAlerts();
  }, []);

  const acknowledge = async (alertId: string) => {
    setBusyId(alertId);
    try {
      await api.alerts.acknowledge(alertId);
      await loadAlerts();
    } catch (requestError) {
      Alert.alert(
        "Could not acknowledge alert",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Alerts"
        subtitle="Safety alerts reported by paired child devices."
      />
      <Text
        style={{
          color: C.navy,
          fontSize: 13,
          fontWeight: "800",
          marginBottom: 10,
        }}
      >
        {alerts.length} alerts
      </Text>
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red }}>
          {error}
        </Text>
      )}
      {!loading && !error && alerts.length === 0 && (
        <Text style={{ color: C.muted }}>No alerts found.</Text>
      )}
      <View style={{ gap: 10 }}>
        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 15,
              padding: 15,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 12,
                backgroundColor: "#F8E8E4",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: C.orange,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 13,
                    fontWeight: "800",
                    flex: 1,
                  }}
                >
                  {alert.title || alert.type.replaceAll("_", " ")}
                </Text>
                {!alert.acknowledgedAt && (
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: C.blue,
                    }}
                  />
                )}
              </View>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
                {new Date(alert.createdAt).toLocaleString()} ·{" "}
                {alert.severity || alert.type}
              </Text>
              <Text
                style={{
                  color: C.text,
                  fontSize: 11,
                  lineHeight: 17,
                  marginTop: 9,
                }}
              >
                {alert.description || alert.type.replaceAll("_", " ")}
              </Text>
              {!alert.acknowledgedAt && (
                <Pressable
                  accessibilityRole="button"
                  disabled={busyId === alert.id}
                  onPress={() => void acknowledge(alert.id)}
                  style={{ alignSelf: "flex-start", marginTop: 10 }}
                >
                  <Text
                    style={{ color: C.blue, fontSize: 12, fontWeight: "800" }}
                  >
                    {busyId === alert.id ? "Saving..." : "Acknowledge"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
