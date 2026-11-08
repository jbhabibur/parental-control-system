import React from "react";
import { View, Text } from "react-native";
import { Screen, Card, Stat, C } from "../../components/ui";

export default function DashboardScreen() {
  return (
    <Screen>
      <Text style={{ color: C.muted, fontSize: 13, fontWeight: "600" }}>PARENT CONTROL</Text>
      <Text style={{ color: C.navy, fontSize: 28, fontWeight: "900", marginTop: 5 }}>Dashboard</Text>
      <Text style={{ color: C.muted, marginTop: 6, marginBottom: 22 }}>Overview of your family’s digital safety</Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 22 }}>
        <Stat label="Connected devices" value="0" detail="No devices linked" />
        <Stat label="Pending requests" value="0" detail="All caught up" />
      </View>
      <Text style={{ color: C.navy, fontSize: 17, fontWeight: "800", marginBottom: 13 }}>Management</Text>
      <Card icon="📱" title="Device management" subtitle="View connected child devices" href="/devices" />
      <Card icon="🔐" title="Permission requests" subtitle="Review and respond to requests" href="/permissions" />
      <Card icon="📊" title="Activity monitoring" subtitle="Review device activity summary" href="/activity" />
      <Card icon="⏱️" title="Screen time & schedule" subtitle="Manage daily limits and schedules" href="/screen-time" />
      <Card icon="🌐" title="Safe browser & DNS" subtitle="Manage website and browsing policies" href="/browser-policy" />
      <Card icon="🔔" title="Alerts" subtitle="Review security and device alerts" href="/alerts" />
      <Card icon="⚙️" title="Settings" subtitle="Account and security preferences" href="/settings" />
      <Text style={{ color: "#9AA5B5", textAlign: "center", fontSize: 11, marginTop: 18 }}>Demo data • Backend not connected</Text>
    </Screen>
  );
}
