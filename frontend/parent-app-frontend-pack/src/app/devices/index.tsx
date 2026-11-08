import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function DevicesScreen() {
  return (
    <Screen>
      <PageHeader title='Device management' subtitle='Connected child devices will appear here.' />
      <InfoRow label='No devices connected' value='Link a child device to begin monitoring.' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
