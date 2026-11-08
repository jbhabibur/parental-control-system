import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function AlertsScreen() {
  const [filter, setFilter] = useState<"All" | "Safety" | "Device">("All");
  const alerts = [
    {
      type: "Safety",
      time: "Today · 9:18 AM",
      title: "Blocked website attempt",
      detail:
        "A sample adult-content domain was blocked by the preview policy.",
      tone: "#C56A58",
      unread: true,
    },
    {
      type: "Device",
      time: "Today · 8:02 AM",
      title: "Device came online",
      detail: "Riley's iPhone connected · Sample event.",
      tone: "#4779B8",
      unread: true,
    },
    {
      type: "Safety",
      time: "Yesterday · 6:24 PM",
      title: "App installation requested",
      detail: "StudySpace is waiting for parent review.",
      tone: "#D49B3D",
      unread: false,
    },
  ];
  const visibleAlerts =
    filter === "All" ? alerts : alerts.filter((alert) => alert.type === filter);

  return (
    <Screen>
      <PageHeader
        title="Alerts"
        subtitle="Review safety events and device notifications."
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
          Sample alerts for preview only. Push notifications and real device
          events are not connected.
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 15 }}>
        {(["All", "Safety", "Device"] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === option }}
            onPress={() => setFilter(option)}
            style={{
              minWidth: 67,
              minHeight: 36,
              paddingHorizontal: 12,
              borderRadius: 18,
              backgroundColor: filter === option ? C.navy : C.white,
              borderWidth: 1,
              borderColor: filter === option ? C.navy : C.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: filter === option ? C.white : C.muted,
                fontSize: 11,
                fontWeight: "800",
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text
        style={{
          color: C.navy,
          fontSize: 13,
          fontWeight: "800",
          marginBottom: 10,
        }}
      >
        {visibleAlerts.length} sample events
      </Text>
      <View style={{ gap: 10 }}>
        {visibleAlerts.map((alert) => (
          <View
            key={alert.title}
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 15,
              padding: 15,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 12,
                backgroundColor: `${alert.tone}18`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: alert.tone,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 13,
                    fontWeight: "800",
                    flex: 1,
                  }}
                >
                  {alert.title}
                </Text>
                {alert.unread && (
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: C.blue,
                    }}
                  />
                )}
              </View>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
                {alert.time} · {alert.type}
              </Text>
              <Text
                style={{
                  color: C.text,
                  fontSize: 11,
                  lineHeight: 17,
                  marginTop: 9,
                }}
              >
                {alert.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
