import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function ScreenTimeScreen() {
  return (
    <Screen>
      <PageHeader title='Screen time & schedule' subtitle='Configure daily usage limits and allowed schedules.' />
      <InfoRow label='Daily screen-time limit' value='Not configured' />
      <InfoRow label='Schedule' value='No schedule configured' />
      <InfoRow label='Remote lock' value='Unavailable until Child App is connected' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
