import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function ScreenTimeScreen() {
  const [limitEnabled, setLimitEnabled] = useState(true);
  const [bedtimeEnabled, setBedtimeEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState([
    "M-0",
    "T-1",
    "W-2",
    "T-3",
    "F-4",
  ]);
  const [paused, setPaused] = useState(false);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const toggleDay = (day: string, index: number) => {
    const key = `${day}-${index}`;
    setSelectedDays((current) =>
      current.includes(key)
        ? current.filter((value) => value !== key)
        : [...current, key],
    );
  };

  return (
    <Screen>
      <PageHeader
        title="Screen time"
        subtitle="Set healthy daily limits and device-free hours."
      />
      <View
        style={{
          backgroundColor: "#FFF8E9",
          borderColor: "#F1E3C5",
          borderWidth: 1,
          borderRadius: 14,
          padding: 13,
          marginBottom: 17,
        }}
      >
        <Text style={{ color: "#72551A", fontSize: 12, lineHeight: 18 }}>
          Preview settings only. Changes are stored in this screen state and are
          not synced to a child device.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: C.navy,
          borderRadius: 18,
          padding: 18,
          marginBottom: 17,
        }}
      >
        <Text style={{ color: "#C5D2E8", fontSize: 11, fontWeight: "800" }}>
          TODAY · SAMPLE USAGE
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginTop: 9,
            gap: 7,
          }}
        >
          <Text style={{ color: C.white, fontSize: 29, fontWeight: "900" }}>
            2h 18m
          </Text>
          <Text style={{ color: "#C5D2E8", fontSize: 12 }}>of 4h limit</Text>
        </View>
        <View
          style={{
            height: 7,
            borderRadius: 5,
            backgroundColor: "#3D4B65",
            marginTop: 14,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "58%",
              height: 7,
              borderRadius: 5,
              backgroundColor: "#7CC7A4",
            }}
          />
        </View>
      </View>

      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 16,
          paddingHorizontal: 15,
          paddingVertical: 5,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            minHeight: 63,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}>
              Daily screen-time limit
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              4 hours per day · Sample
            </Text>
          </View>
          <Switch
            value={limitEnabled}
            onValueChange={setLimitEnabled}
            trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
            thumbColor={limitEnabled ? "#28744D" : "#FFFFFF"}
            accessibilityLabel="Enable daily screen-time limit"
          />
        </View>
        <View style={{ height: 1, backgroundColor: C.border }} />
        <View
          style={{
            minHeight: 63,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}>
              Bedtime schedule
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              Every day · 9:00 PM to 7:00 AM
            </Text>
          </View>
          <Switch
            value={bedtimeEnabled}
            onValueChange={setBedtimeEnabled}
            trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
            thumbColor={bedtimeEnabled ? "#28744D" : "#FFFFFF"}
            accessibilityLabel="Enable bedtime schedule"
          />
        </View>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 16,
          fontWeight: "900",
          marginBottom: 10,
        }}
      >
        Bedtime days
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 6,
          marginBottom: 19,
        }}
      >
        {days.map((day, index) => {
          const key = `${day}-${index}`;
          const active = selectedDays.includes(key);
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index]} bedtime`}
              onPress={() => toggleDay(day, index)}
              style={{
                width: 39,
                height: 39,
                borderRadius: 20,
                backgroundColor: active ? C.navy : C.white,
                borderWidth: 1,
                borderColor: active ? C.navy : C.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: active ? C.white : C.muted,
                  fontSize: 12,
                  fontWeight: "800",
                }}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 16,
          fontWeight: "900",
          marginBottom: 10,
        }}
      >
        App limits · sample
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 15,
          marginBottom: 18,
        }}
      >
        {[
          { name: "Video", limit: "1h / day", color: "#C56A58" },
          { name: "Games", limit: "45m / day", color: "#D49B3D" },
          { name: "Schoolwork", limit: "No limit", color: "#4B8F72" },
        ].map((app, index) => (
          <View
            key={app.name}
            style={{
              minHeight: 53,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: index === 2 ? 0 : 1,
              borderBottomColor: C.border,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 9 }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  backgroundColor: app.color,
                }}
              />
              <Text style={{ color: C.navy, fontSize: 12, fontWeight: "700" }}>
                {app.name}
              </Text>
            </View>
            <Text style={{ color: C.muted, fontSize: 12, fontWeight: "700" }}>
              {app.limit}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setPaused((current) => !current);
          Alert.alert(
            "Preview only",
            "Remote pause is not connected to a child device.",
          );
        }}
        style={{
          minHeight: 49,
          borderRadius: 13,
          backgroundColor: paused ? "#EAF4EF" : C.navy,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: paused ? "#28744D" : C.white,
            fontSize: 13,
            fontWeight: "800",
          }}
        >
          {paused ? "End pause preview" : "Pause device now"}
        </Text>
      </Pressable>
    </Screen>
  );
}
