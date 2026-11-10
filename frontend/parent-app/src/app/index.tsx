import React from "react";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { hasAccessToken, api } from "../lib/api";

export default function Index() {
  const [route, setRoute] = useState<"checking" | "dashboard" | "login">(
    "checking",
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        if (!(await hasAccessToken("user"))) {
          if (active) setRoute("login");
          return;
        }
        await api.auth.parentMe();
        if (active) setRoute("dashboard");
      } catch {
        if (active) setRoute("login");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (route === "checking")
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  return (
    <Redirect href={route === "dashboard" ? "/dashboard" : "/auth/login"} />
  );
}
