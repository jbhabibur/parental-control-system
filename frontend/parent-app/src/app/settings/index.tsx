import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api, clearTokens, getRefreshToken } from "../../lib/api";

type ParentProfile = { name?: string; email?: string; role?: string };

export default function SettingsScreen() {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [health, setHealth] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([api.auth.parentMe(), api.mfa.status(), api.health()]).then(([profileResult, mfaResult, healthResult]) => {
      if (!active) return;
      setProfile(profileResult.user as ParentProfile);
      const status = mfaResult.data as { enabled?: boolean } | undefined;
      setMfaEnabled(Boolean(status?.enabled));
      setHealth(String(healthResult.status || "Unknown"));
    }).catch((requestError) => {
      if (active) setError(requestError instanceof ApiError ? requestError.message : "Unable to load account settings.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const setupMfa = async () => {
    setBusy(true);
    try {
      const result = await api.mfa.setup();
      const data = result.data as { qrCode?: string; secret?: string } | undefined;
      setMfaQrCode(data?.qrCode || "");
      setMfaSecret(data?.secret || "");
    } catch (requestError) {
      Alert.alert("Could not set up MFA", requestError instanceof ApiError ? requestError.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await getRefreshToken("user");
      if (refreshToken) await api.auth.logout(refreshToken);
    } catch {
      setError("The server could not be reached. Local sign-in credentials were still cleared.");
    } finally {
      await clearTokens("user");
      router.replace("/auth/login");
    }
  };

  const navigate = (label: string, href: "/notifications" | "/location" | "/app-policies") => (
    <Pressable key={label} onPress={() => router.push(href)} style={{ minHeight: 48, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ color: C.navy, fontWeight: "700" }}>{label}</Text><Text style={{ color: C.blue, fontSize: 20 }}>›</Text>
    </Pressable>
  );

  return (
    <Screen>
      <PageHeader title="Settings" subtitle="Parent account and security status." />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && <Text accessibilityRole="alert" style={{ color: C.red, marginBottom: 10 }}>{error}</Text>}
      <View style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 15, marginBottom: 18 }}>
        <Text style={{ color: C.navy, fontWeight: "900" }}>Parent account</Text>
        <Text style={{ color: C.text, marginTop: 8 }}>{profile?.name || "—"}</Text>
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{profile?.email || ""} · {profile?.role || ""}</Text>
      </View>
      <Text style={{ color: C.navy, fontSize: 15, fontWeight: "900", marginBottom: 8 }}>Account security</Text>
      <View style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 15, marginBottom: 18 }}>
        <Text style={{ color: C.text, fontWeight: "800" }}>Multi-factor authentication</Text>
        <Text style={{ color: mfaEnabled ? C.green : C.muted, fontSize: 12, marginTop: 5 }}>{mfaEnabled ? "Enabled" : "Not enabled"}</Text>
        {!mfaEnabled && <Pressable disabled={busy} onPress={() => void setupMfa()} style={{ alignSelf: "flex-start", minHeight: 40, justifyContent: "center" }}><Text style={{ color: C.blue, fontWeight: "800" }}>{busy ? "Preparing..." : "Set up authenticator"}</Text></Pressable>}
        {!!mfaQrCode && <View style={{ alignItems: "flex-start", marginTop: 10 }}><Image source={{ uri: mfaQrCode }} style={{ width: 180, height: 180 }} /><Text selectable style={{ color: C.navy, fontSize: 12, marginTop: 8 }}>Secret: {mfaSecret}</Text></View>}
        <Text style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 7 }}>The backend currently rejects the normal MFA enable/disable body during validation, so setup cannot be completed until that backend issue is fixed.</Text>
      </View>
      <Text style={{ color: C.navy, fontSize: 15, fontWeight: "900", marginBottom: 8 }}>Family data</Text>
      <View style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, marginBottom: 18 }}>
        {navigate("Notifications", "/notifications")}
        {navigate("Device locations", "/location")}
        {navigate("Application policies", "/app-policies")}
      </View>
      <View style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 13, marginBottom: 18 }}><Text style={{ color: C.muted, fontSize: 11 }}>Backend status</Text><Text style={{ color: health === "Healthy" ? C.green : C.text, fontWeight: "800", marginTop: 4 }}>{health || "Checking..."}</Text></View>
      <Pressable accessibilityRole="button" onPress={() => void logout()} style={{ minHeight: 47, borderRadius: 12, borderWidth: 1, borderColor: "#E7C9C4", alignItems: "center", justifyContent: "center" }}><Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>Sign out</Text></Pressable>
    </Screen>
  );
}
