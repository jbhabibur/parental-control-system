import React from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/auth-context";
import { C } from "../components/ui";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: C.bg,
        }}
      >
        <ActivityIndicator size="large" color={C.blue} />
      </View>
    );
  }

  return (
    <Redirect href={isAuthenticated ? "/dashboard" : "/auth/login"} />
  );
}
