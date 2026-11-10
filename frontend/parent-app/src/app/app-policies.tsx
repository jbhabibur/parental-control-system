import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../components/ui";
import { ApiError, api } from "../lib/api";

type DeviceOption = { id: string; deviceName: string };
type AppPolicy = { id: string; appIdentifier: string; appName?: string | null; decision: string; category?: string | null };

export default function AppPoliciesScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policies, setPolicies] = useState<AppPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void api.devices.list().then((result) => {
      const entries = Array.isArray(result.data) ? result.data as DeviceOption[] : [];
      if (!active) return;
      setDevices(entries);
      setDeviceId(entries[0]?.id || "");
    }).catch((requestError) => {
      if (active) setError(requestError instanceof ApiError ? requestError.message : "Unable to load devices.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");
    void api.appPolicies.list(deviceId).then((result) => {
      if (active) setPolicies(Array.isArray(result.data) ? result.data as AppPolicy[] : []);
    }).catch((requestError) => {
      if (active) setError(requestError instanceof ApiError ? requestError.message : "Unable to load application policies.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [deviceId]);

  const removePolicy = async (policyId: string) => {
    try {
      await api.appPolicies.delete(deviceId, policyId);
      setPolicies((current) => current.filter((policy) => policy.id !== policyId));
    } catch (requestError) {
      Alert.alert("Could not remove policy", requestError instanceof ApiError ? requestError.message : "Please try again.");
    }
  };

  return (
    <Screen>
      <PageHeader title="App policies" subtitle="Review application allow/block rules." />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && <Text accessibilityRole="alert" style={{ color: C.red, marginBottom: 10 }}>{error}</Text>}
      {devices.map((item) => <Pressable key={item.id} onPress={() => setDeviceId(item.id)} style={{ borderWidth: 1, borderColor: item.id === deviceId ? C.blue : C.border, backgroundColor: item.id === deviceId ? C.pale : C.white, borderRadius: 10, padding: 12, marginBottom: 7 }}><Text style={{ color: C.navy, fontWeight: "800" }}>{item.deviceName}</Text></Pressable>)}
      {!loading && !error && deviceId && policies.length === 0 && <Text style={{ color: C.muted, marginTop: 10 }}>No application policies for this device.</Text>}
      {policies.map((policy) => (
        <View key={policy.id} style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 13, marginTop: 8 }}>
          <Text style={{ color: C.navy, fontWeight: "900" }}>{policy.appName || policy.appIdentifier}</Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{policy.appIdentifier}{policy.category ? ` · ${policy.category}` : ""}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: policy.decision === "BLOCK" ? C.red : C.green, fontWeight: "900", fontSize: 11 }}>{policy.decision}</Text>
            <Pressable onPress={() => void removePolicy(policy.id)}>
              <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
      <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 16 }}>Creating and editing app policies are unavailable because the backend currently rejects the documented request shape. The backend has not been changed.</Text>
    </Screen>
  );
}
