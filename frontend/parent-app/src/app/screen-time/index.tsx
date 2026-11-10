import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type DeviceOption = { id: string; deviceName: string };
type AppLimit = {
  id: string;
  appIdentifier: string;
  limitMinutes: number;
};
type Policy = {
  id?: string;
  enabled: boolean;
  dailyLimitMinutes: number;
  bedtimeStart?: string | null;
  bedtimeEnd?: string | null;
  timezone?: string;
};

export default function ScreenTimeScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [limits, setLimits] = useState<AppLimit[]>([]);
  const [dailyLimit, setDailyLimit] = useState("120");
  const [bedtimeStart, setBedtimeStart] = useState("21:00");
  const [bedtimeEnd, setBedtimeEnd] = useState("07:00");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [enabled, setEnabled] = useState(true);
  const [appIdentifier, setAppIdentifier] = useState("");
  const [appLimitMinutes, setAppLimitMinutes] = useState("30");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    void Promise.allSettled([
      api.screenTime.get(deviceId),
      api.screenTime.appLimits(deviceId),
    ])
      .then(([policyResult, limitsResult]) => {
        if (!active) return;
        if (policyResult.status === "fulfilled") {
          const nextPolicy = policyResult.value.data as Policy;
          setPolicy(nextPolicy);
          setDailyLimit(String(nextPolicy.dailyLimitMinutes));
          setBedtimeStart(nextPolicy.bedtimeStart || "21:00");
          setBedtimeEnd(nextPolicy.bedtimeEnd || "07:00");
          setTimezone(nextPolicy.timezone || "Asia/Dhaka");
          setEnabled(nextPolicy.enabled);
        } else if (
          !(
            policyResult.reason instanceof ApiError &&
            policyResult.reason.status === 404
          )
        ) {
          setError(
            policyResult.reason instanceof ApiError
              ? policyResult.reason.message
              : "Unable to load policy.",
          );
        } else {
          setPolicy(null);
        }
        if (limitsResult.status === "fulfilled")
          setLimits(
            Array.isArray(limitsResult.value.data)
              ? (limitsResult.value.data as AppLimit[])
              : [],
          );
        else if (limitsResult.reason instanceof ApiError)
          setError(limitsResult.reason.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deviceId]);

  const savePolicy = async () => {
    const minutes = Number(dailyLimit);
    if (!deviceId || !Number.isInteger(minutes) || minutes < 1) {
      Alert.alert(
        "Invalid limit",
        "Choose a device and enter a positive whole number of minutes.",
      );
      return;
    }
    setSaving(true);
    try {
      const body = {
        dailyLimitMinutes: minutes,
        enabled,
        bedtimeStart,
        bedtimeEnd,
        timezone,
      };
      const result = policy
        ? await api.screenTime.update(deviceId, body)
        : await api.screenTime.create(deviceId, body);
      setPolicy(result.data as Policy);
      Alert.alert("Saved", "Screen-time policy was saved.");
    } catch (requestError) {
      Alert.alert(
        "Could not save policy",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const addAppLimit = async () => {
    const minutes = Number(appLimitMinutes);
    if (
      !deviceId ||
      !appIdentifier.trim() ||
      !Number.isInteger(minutes) ||
      minutes < 1
    ) {
      Alert.alert(
        "Invalid app limit",
        "Enter an app identifier and a positive whole number of minutes.",
      );
      return;
    }
    try {
      await api.screenTime.createAppLimit(deviceId, {
        appIdentifier: appIdentifier.trim(),
        limitMinutes: minutes,
      });
      setAppIdentifier("");
      const result = await api.screenTime.appLimits(deviceId);
      setLimits(Array.isArray(result.data) ? (result.data as AppLimit[]) : []);
    } catch (requestError) {
      Alert.alert(
        "Could not add app limit",
        requestError instanceof ApiError
          ? requestError.message
          : "Create a screen-time policy first.",
      );
    }
  };

  const removeAppLimit = async (limitId: string) => {
    try {
      await api.screenTime.deleteAppLimit(deviceId, limitId);
      setLimits((current) => current.filter((item) => item.id !== limitId));
    } catch (requestError) {
      Alert.alert(
        "Could not remove app limit",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  const pauseDevice = async () => {
    try {
      await api.commands.create(deviceId, { commandType: "PAUSE" });
      Alert.alert(
        "Command queued",
        "The child app must be online to receive this command.",
      );
    } catch (requestError) {
      Alert.alert(
        "Could not queue command",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Screen time"
        subtitle="Configure policy for a connected child device."
      />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}
      {devices.length === 0 && !loading && (
        <Text style={{ color: C.muted }}>
          Connect a child device before configuring screen time.
        </Text>
      )}
      {devices.length > 0 && (
        <>
          <Text style={{ color: C.navy, fontWeight: "800", marginBottom: 8 }}>
            Device
          </Text>
          <View style={{ gap: 7, marginBottom: 16 }}>
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
                }}
              >
                <Text style={{ color: C.navy, fontWeight: "700" }}>
                  {item.deviceName}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 14,
              padding: 15,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <Text style={{ color: C.navy, fontWeight: "900" }}>
                Policy enabled
              </Text>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
                thumbColor={enabled ? "#28744D" : "#FFFFFF"}
                accessibilityLabel="Enable screen-time policy"
              />
            </View>
            <Text style={{ color: C.text, fontSize: 12, marginBottom: 6 }}>
              Daily limit (minutes)
            </Text>
            <TextInput
              value={dailyLimit}
              onChangeText={setDailyLimit}
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                padding: 11,
                marginBottom: 12,
                color: C.text,
              }}
            />
            <Text style={{ color: C.text, fontSize: 12, marginBottom: 6 }}>
              Bedtime start (HH:mm)
            </Text>
            <TextInput
              value={bedtimeStart}
              onChangeText={setBedtimeStart}
              placeholder="21:00"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                padding: 11,
                marginBottom: 12,
                color: C.text,
              }}
            />
            <Text style={{ color: C.text, fontSize: 12, marginBottom: 6 }}>
              Bedtime end (HH:mm)
            </Text>
            <TextInput
              value={bedtimeEnd}
              onChangeText={setBedtimeEnd}
              placeholder="07:00"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                padding: 11,
                marginBottom: 12,
                color: C.text,
              }}
            />
            <Text style={{ color: C.text, fontSize: 12, marginBottom: 6 }}>
              Timezone
            </Text>
            <TextInput
              value={timezone}
              onChangeText={setTimezone}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                padding: 11,
                marginBottom: 12,
                color: C.text,
              }}
            />
            <Pressable
              disabled={saving}
              onPress={() => void savePolicy()}
              style={{
                minHeight: 46,
                borderRadius: 10,
                backgroundColor: C.blue,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.white, fontWeight: "800" }}>
                {saving
                  ? "Saving..."
                  : policy
                    ? "Update policy"
                    : "Create policy"}
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              color: C.navy,
              fontSize: 17,
              fontWeight: "900",
              marginBottom: 8,
            }}
          >
            Per-app limits
          </Text>
          {!policy && (
            <Text style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
              Create a screen-time policy before adding app limits.
            </Text>
          )}
          {limits.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: C.white,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
                paddingVertical: 11,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.navy, fontWeight: "700" }}>
                  {item.appIdentifier}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                  {item.limitMinutes} minutes
                </Text>
              </View>
              <Pressable onPress={() => void removeAppLimit(item.id)}>
                <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
              </Pressable>
            </View>
          ))}
          {!!policy && (
            <View
              style={{
                marginTop: 13,
                backgroundColor: C.white,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 12,
                padding: 12,
                gap: 9,
              }}
            >
              <TextInput
                value={appIdentifier}
                onChangeText={setAppIdentifier}
                placeholder="Package / app identifier"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 9,
                  padding: 10,
                  color: C.text,
                }}
              />
              <TextInput
                value={appLimitMinutes}
                onChangeText={setAppLimitMinutes}
                placeholder="Minutes per day"
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 9,
                  padding: 10,
                  color: C.text,
                }}
              />
              <Pressable
                onPress={() => void addAppLimit()}
                style={{
                  minHeight: 42,
                  borderRadius: 9,
                  backgroundColor: C.pale,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: C.blue, fontWeight: "800" }}>
                  Add app limit
                </Text>
              </Pressable>
            </View>
          )}
          <Pressable
            onPress={() => void pauseDevice()}
            style={{
              marginTop: 18,
              minHeight: 46,
              borderRadius: 10,
              backgroundColor: C.navy,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: C.white, fontWeight: "800" }}>
              Queue pause command
            </Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}
