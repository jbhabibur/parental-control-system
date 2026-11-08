import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function BrowserPolicyScreen() {
  return (
    <Screen>
      <PageHeader title='Safe browser & DNS' subtitle='Manage browsing rules for connected child devices.' />
      <InfoRow label='Website filtering' value='Not configured' />
      <InfoRow label='Allowed websites' value='No websites added' />
      <InfoRow label='Blocked websites' value='No websites added' />
      <InfoRow label='DNS policy' value='Not configured' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
