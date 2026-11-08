import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function ActivityScreen() {
  return (
    <Screen>
      <PageHeader title='Activity monitoring' subtitle='A summary of activity reported by linked devices.' />
      <InfoRow label='No activity data' value='Activity information will appear after a child device is connected.' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
