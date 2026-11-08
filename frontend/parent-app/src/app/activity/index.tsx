import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function ActivityScreen() {
  const [period, setPeriod] = useState<"Today" | "This week">("Today");
  const apps = [
    {
      name: "Schoolwork",
      detail: "Education",
      time: "54 min",
      value: 78,
      color: "#4B8F72",
    },
    {
      name: "Safari",
      detail: "Web browser",
      time: "38 min",
      value: 55,
      color: "#4779B8",
    },
    {
      name: "Messages",
      detail: "Communication",
      time: "26 min",
      value: 38,
      color: "#D49B3D",
    },
    {
      name: "Video",
      detail: "Entertainment",
      time: "20 min",
      value: 29,
      color: "#C56A58",
    },
  ];

  return (
    <Screen>
      <PageHeader
        title="Activity"
        subtitle="Understand app use and browsing patterns."
      />
      <View
        style={{
          backgroundColor: "#EAF4EF",
          borderColor: "#D1E8DA",
          borderWidth: 1,
          borderRadius: 14,
          padding: 13,
          marginBottom: 17,
        }}
      >
        <Text style={{ color: "#45695A", fontSize: 12, lineHeight: 18 }}>
          Sample activity for layout preview. No usage or browsing history is
          being collected.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#E9EDF3",
          borderRadius: 12,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {(["Today", "This week"] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: period === option }}
            onPress={() => setPeriod(option)}
            style={{
              flex: 1,
              minHeight: 39,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: period === option ? C.white : "transparent",
            }}
          >
            <Text
              style={{
                color: period === option ? C.navy : C.muted,
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <View
        style={{
          backgroundColor: C.navy,
          borderRadius: 18,
          padding: 18,
          marginBottom: 18,
        }}
      >
        <Text style={{ color: "#C5D2E8", fontSize: 11, fontWeight: "800" }}>
          {period.toUpperCase()} · RILEY&apos;S IPHONE
        </Text>
        <Text
          style={{
            color: C.white,
            fontSize: 31,
            fontWeight: "900",
            marginTop: 8,
          }}
        >
          {period === "Today" ? "2h 18m" : "12h 46m"}
        </Text>
        <Text style={{ color: "#C5D2E8", fontSize: 12, marginTop: 4 }}>
          of {period === "Today" ? "4 hours" : "28 hours"} allowed
        </Text>
        <View
          style={{
            height: 7,
            borderRadius: 5,
            backgroundColor: "#3D4B65",
            marginTop: 17,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: period === "Today" ? "58%" : "46%",
              height: 7,
              borderRadius: 5,
              backgroundColor: "#7CC7A4",
            }}
          />
        </View>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginBottom: 11,
        }}
      >
        Most-used apps
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 16,
          paddingHorizontal: 15,
          paddingVertical: 2,
        }}
      >
        {apps.map((app, index) => (
          <View
            key={app.name}
            style={{
              paddingVertical: 14,
              borderBottomWidth: index === apps.length - 1 ? 0 : 1,
              borderBottomColor: C.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}
                >
                  {app.name}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                  {app.detail}
                </Text>
              </View>
              <Text style={{ color: C.navy, fontSize: 12, fontWeight: "800" }}>
                {app.time}
              </Text>
            </View>
            <View
              style={{
                height: 5,
                borderRadius: 4,
                backgroundColor: "#EEF1F5",
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${app.value}%`,
                  height: 5,
                  borderRadius: 4,
                  backgroundColor: app.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 17,
          fontWeight: "900",
          marginTop: 21,
          marginBottom: 10,
        }}
      >
        Recent activity
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          padding: 15,
          gap: 14,
        }}
      >
        {[
          {
            time: "9:18 AM",
            title: "Opened Safari",
            note: "Web browsing · Sample event",
          },
          {
            time: "8:42 AM",
            title: "Schoolwork session",
            note: "Education · Sample event",
          },
        ].map((event) => (
          <View key={event.time} style={{ flexDirection: "row", gap: 12 }}>
            <Text
              style={{ color: C.muted, fontSize: 11, width: 62, paddingTop: 2 }}
            >
              {event.time}
            </Text>
            <View
              style={{
                flex: 1,
                borderLeftWidth: 2,
                borderLeftColor: "#DCE5F0",
                paddingLeft: 12,
              }}
            >
              <Text style={{ color: C.navy, fontSize: 12, fontWeight: "800" }}>
                {event.title}
              </Text>
              <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                {event.note}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
