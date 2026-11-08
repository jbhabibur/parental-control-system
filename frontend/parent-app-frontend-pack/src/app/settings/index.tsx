import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function SettingsScreen() {
  return (
    <Screen>
      <PageHeader title='Settings' subtitle='Manage your parent account and security preferences.' />
      <InfoRow label='Account' value='Not connected' />
      <InfoRow label='Multi-factor authentication' value='Configure after backend integration' />
      <InfoRow label='Biometric authentication' value='Configure on supported devices' />
      <InfoRow label='Secure connection' value='API security will be configured with backend' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
