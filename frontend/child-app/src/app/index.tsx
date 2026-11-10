import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { api, clearTokens, hasAccessToken } from "../lib/api";

export default function Index() {
  const [route, setRoute] = useState<"checking" | "paired" | "login">(
    "checking",
  );
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        if (!(await hasAccessToken("device"))) {
          if (active) setRoute("login");
          return;
        }
        await api.pairing.heartbeat();
        if (active) setRoute("paired");
      } catch {
        await clearTokens("device");
        if (active) setRoute("login");
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  if (route === "checking")
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  return (
    <Redirect
      href={route === "paired" ? "/monitoring-status" : "/(auth)/login"}
    />
  );
}
