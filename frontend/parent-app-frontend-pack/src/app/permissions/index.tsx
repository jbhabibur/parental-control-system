import React from "react";
import { Text } from "react-native";
import { Screen, PageHeader, InfoRow, C } from "../../components/ui";

export default function PermissionsScreen() {
  return (
    <Screen>
      <PageHeader title='Permission requests' subtitle='Review requests submitted from the Child App.' />
      <InfoRow label='No pending requests' value='New child permission requests will appear here.' />
      <Text style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 18 }}>Demo screen • Backend integration pending</Text>
    </Screen>
  );
}
