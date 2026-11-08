import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function AlertsScreen() {
  return (
    <Screen>
      <PageHeader title='Alerts' subtitle='Important security and device notifications.' />
      <InfoRow label='All clear' value='There are no alerts in this demo.' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
