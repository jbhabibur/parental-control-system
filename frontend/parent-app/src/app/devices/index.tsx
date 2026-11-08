import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function DevicesScreen() {
  const [paused, setPaused] = useState(false);

  return (
    <Screen>
      <PageHeader
        title="Child devices"
        subtitle="Review device status and family controls."
      />
      <View
        style={{
          backgroundColor: "#EAF4EF",
          borderColor: "#D1E8DA",
          borderWidth: 1,
          borderRadius: 14,
          padding: 13,
          marginBottom: 17,
          flexDirection: "row",
          gap: 9,
        }}
      >
        <Text style={{ color: "#25704B", fontSize: 13, fontWeight: "800" }}>
          PREVIEW
        </Text>
        <Text
          style={{ color: "#45695A", flex: 1, fontSize: 12, lineHeight: 18 }}
        >
          Sample device information. Controls on this screen do not reach a
          child device.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.border,
          padding: 17,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: "#EAF0F8",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 23 }}>▣</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}>
              Riley&apos;s iPhone
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
              iPhone 14 · iOS 18.2
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#2E9C68",
              }}
            />
            <Text style={{ color: "#28744D", fontSize: 11, fontWeight: "800" }}>
              ONLINE*
            </Text>
          </View>
        </View>
        <View
          style={{ height: 1, backgroundColor: C.border, marginVertical: 16 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View>
            <Text style={{ color: C.muted, fontSize: 11 }}>LAST SYNC*</Text>
            <Text
              style={{
                color: C.navy,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 5,
              }}
            >
              Today, 9:41 AM
            </Text>
          </View>
          <View>
            <Text style={{ color: C.muted, fontSize: 11 }}>BATTERY*</Text>
            <Text
              style={{
                color: C.navy,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 5,
              }}
            >
              78%
            </Text>
          </View>
          <View>
            <Text style={{ color: C.muted, fontSize: 11 }}>SCREEN TIME*</Text>
            <Text
              style={{
                color: C.navy,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 5,
              }}
            >
              2h 18m
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 9, marginTop: 18 }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPaused((current) => !current)}
            style={{
              flex: 1,
              minHeight: 46,
              borderRadius: 12,
              backgroundColor: paused ? "#EAF4EF" : C.navy,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: paused ? "#25704B" : C.white,
                fontWeight: "800",
                fontSize: 13,
              }}
            >
              {paused ? "Resume preview" : "Pause preview"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                "Preview only",
                "Remote lock becomes available after connecting the parent and child apps.",
              )
            }
            style={{
              minWidth: 108,
              minHeight: 46,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: C.border,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}>
              Remote lock
            </Text>
          </Pressable>
        </View>
        {paused && (
          <Text style={{ color: "#25704B", fontSize: 11, marginTop: 10 }}>
            Preview state only. The child device is not paused.
          </Text>
        )}
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginBottom: 10,
        }}
      >
        Device permissions
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 15,
          marginBottom: 16,
        }}
      >
        {["Location", "Camera", "Microphone", "App installation"].map(
          (permission, index) => (
            <View
              key={permission}
              style={{
                minHeight: 48,
                borderBottomWidth: index === 3 ? 0 : 1,
                borderBottomColor: C.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: C.text, fontSize: 13 }}>{permission}</Text>
              <Text
                style={{
                  color: index === 0 ? "#28744D" : C.muted,
                  fontSize: 12,
                  fontWeight: "800",
                }}
              >
                {index === 0 ? "Allowed*" : "Ask first*"}
              </Text>
            </View>
          ),
        )}
      </View>
      <Link href="/permissions" asChild>
        <Pressable
          accessibilityRole="button"
          style={{
            backgroundColor: "#EFF4FB",
            borderRadius: 14,
            padding: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 13 }}>
              Permission requests
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              Review requests from your child
            </Text>
          </View>
          <Text style={{ color: C.blue, fontWeight: "900", fontSize: 20 }}>
            ›
          </Text>
        </Pressable>
      </Link>
      <Text
        style={{ color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 16 }}
      >
        * Illustrative sample values, not live device telemetry.
      </Text>
    </Screen>
  );
}
