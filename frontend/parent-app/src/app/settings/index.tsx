import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function SettingsScreen() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const showNotConnected = (feature: string) =>
    Alert.alert(
      "Not connected",
      `${feature} will be available when account services are integrated.`,
    );

  return (
    <Screen>
      <PageHeader
        title="Settings"
        subtitle="Manage your parent account and security preferences."
      />
      <View
        style={{
          backgroundColor: "#FFF8E9",
          borderColor: "#F1E3C5",
          borderWidth: 1,
          borderRadius: 14,
          padding: 13,
          marginBottom: 18,
        }}
      >
        <Text style={{ color: "#72551A", fontSize: 12, lineHeight: 18 }}>
          Preview preferences only. Authentication, encryption, and notification
          settings are not backed by account services yet.
        </Text>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 15,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        Parent account
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => showNotConnected("Account profile")}
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 15,
            backgroundColor: "#EAF0F8",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: C.navy, fontSize: 17, fontWeight: "900" }}>
            P
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}>
            Parent profile
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            Sign in to connect your account
          </Text>
        </View>
        <Text style={{ color: C.muted, fontSize: 20 }}>›</Text>
      </Pressable>

      <Text
        style={{
          color: C.navy,
          fontSize: 15,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        Sign-in security
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 14,
          marginBottom: 18,
        }}
      >
        {[
          {
            title: "Two-factor authentication",
            note: "Require a second sign-in step",
            value: mfaEnabled,
            change: setMfaEnabled,
          },
          {
            title: "Biometric unlock",
            note: "Use Face ID or fingerprint on this device",
            value: biometricsEnabled,
            change: setBiometricsEnabled,
          },
        ].map((setting, index) => (
          <View
            key={setting.title}
            style={{
              minHeight: 66,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: index === 0 ? 1 : 0,
              borderBottomColor: C.border,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ color: C.navy, fontSize: 12, fontWeight: "800" }}>
                {setting.title}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
                {setting.note}
              </Text>
            </View>
            <Switch
              value={setting.value}
              onValueChange={setting.change}
              trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
              thumbColor={setting.value ? "#28744D" : "#FFFFFF"}
              accessibilityLabel={`Preview ${setting.title}`}
            />
          </View>
        ))}
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 15,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        Notifications
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 14,
          marginBottom: 18,
        }}
      >
        <View
          style={{
            minHeight: 65,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ color: C.navy, fontSize: 12, fontWeight: "800" }}>
              Safety alerts
            </Text>
            <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
              Blocked content and permission requests
            </Text>
          </View>
          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
            trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
            thumbColor={alertsEnabled ? "#28744D" : "#FFFFFF"}
            accessibilityLabel="Preview safety alerts"
          />
        </View>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 15,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        Data & connection
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          padding: 15,
          marginBottom: 18,
        }}
      >
        {[
          { title: "Encrypted connection", value: "Not configured" },
          { title: "Certificate pinning", value: "Backend required" },
          { title: "Privacy policy", value: "Add before release" },
        ].map((item, index) => (
          <View
            key={item.title}
            style={{
              minHeight: 43,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: index === 2 ? 0 : 1,
              borderBottomColor: C.border,
            }}
          >
            <Text style={{ color: C.text, fontSize: 11 }}>{item.title}</Text>
            <Text style={{ color: C.muted, fontSize: 10, fontWeight: "700" }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/auth/login")}
        style={{
          minHeight: 47,
          borderRadius: 13,
          borderWidth: 1,
          borderColor: "#E7C9C4",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>
          Sign out
        </Text>
      </Pressable>
    </Screen>
  );
}
