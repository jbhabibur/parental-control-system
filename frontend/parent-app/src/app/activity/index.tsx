import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type ActivityRow = Record<string, unknown>;

export default function ActivityScreen() {
  const [deviceName, setDeviceName] = useState("");
  const [usage, setUsage] = useState<ActivityRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [history, setHistory] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const deviceResult = await api.devices.list();
        const devices = Array.isArray(deviceResult.data)
          ? (deviceResult.data as Array<{ id: string; deviceName: string }>)
          : [];
        const selected = devices[0];
        if (!selected) {
          if (active) setDeviceName("");
          return;
        }
        const [usageResult, activityResult, historyResult] = await Promise.all([
          api.usage.list(selected.id),
          api.activity.list(selected.id),
          api.browserHistory.list(selected.id),
        ]);
        if (!active) return;
        setDeviceName(selected.deviceName);
        setUsage(
          Array.isArray(usageResult.data)
            ? (usageResult.data as ActivityRow[])
            : [],
        );
        setActivities(
          Array.isArray(activityResult.data)
            ? (activityResult.data as ActivityRow[])
            : [],
        );
        setHistory(
          Array.isArray(historyResult.data)
            ? (historyResult.data as ActivityRow[])
            : [],
        );
      } catch (requestError) {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load activity.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (value: unknown) =>
    typeof value === "string"
      ? new Date(value).toLocaleString()
      : "Time unavailable";
  const formatDuration = (value: unknown) => {
    const seconds = typeof value === "number" ? value : 0;
    return `${Math.floor(seconds / 60)} min`;
  };

  return (
    <Screen>
      <PageHeader
        title="Activity"
        subtitle="App sessions, device activity, and browsing history from the backend."
      />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red }}>
          {error}
        </Text>
      )}
      {!loading && !error && !deviceName && (
        <Text style={{ color: C.muted }}>
          Connect a child device to view activity.
        </Text>
      )}
      {!!deviceName && (
        <Text style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>
          {deviceName}
        </Text>
      )}
      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        App usage ({usage.length})
      </Text>
      {usage.length === 0 && !loading && (
        <Text style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>
          No app usage records have been reported.
        </Text>
      )}
      {usage.map((row, index) => (
        <View
          key={String(row.id || index)}
          style={{
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            padding: 13,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: C.navy, fontWeight: "800" }}>
            {String(row.appIdentifier || "App")}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            {formatDuration(row.durationSeconds)} · {formatDate(row.startedAt)}
          </Text>
        </View>
      ))}
      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginTop: 18,
          marginBottom: 9,
        }}
      >
        Device events ({activities.length})
      </Text>
      {activities.map((row, index) => (
        <View
          key={String(row.id || index)}
          style={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}>
            {String(row.activityType || "Activity")}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            {formatDate(row.capturedAt)}
            {row.foregroundApp ? ` · ${String(row.foregroundApp)}` : ""}
          </Text>
        </View>
      ))}
      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginTop: 18,
          marginBottom: 9,
        }}
      >
        Browsing history ({history.length})
      </Text>
      {history.map((row, index) => (
        <View
          key={String(row.id || index)}
          style={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}
          >
            {String(row.pageTitle || row.domain || row.url || "Visited page")}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            {String(row.domain || "")} · {formatDate(row.visitedAt)}
            {row.blocked ? " · blocked" : ""}
          </Text>
        </View>
      ))}
    </Screen>
  );
}
