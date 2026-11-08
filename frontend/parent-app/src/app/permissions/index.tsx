import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function PermissionsScreen() {
  const [requestStatus, setRequestStatus] = useState<
    "pending" | "approved" | "denied"
  >("pending");

  const respond = (decision: "approved" | "denied") => {
    setRequestStatus(decision);
    Alert.alert(
      "Preview updated",
      `Request marked ${decision}. No permission was changed on a device.`,
    );
  };

  return (
    <Screen>
      <PageHeader
        title="Permission requests"
        subtitle="Review access requests submitted from a child device."
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
          Preview request only. Approve and deny update this screen locally;
          they do not grant access on a device.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: C.white,
          borderColor: C.border,
          borderWidth: 1,
          borderRadius: 17,
          padding: 17,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: C.muted, fontSize: 11, fontWeight: "800" }}>
            APP ACCESS · TODAY, 9:32 AM
          </Text>
          <View
            style={{
              backgroundColor:
                requestStatus === "pending" ? "#FFF1D8" : "#EAF4EF",
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: requestStatus === "pending" ? "#805B14" : "#28744D",
                fontSize: 10,
                fontWeight: "900",
              }}
            >
              {requestStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 19,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 15,
              backgroundColor: "#EAF0F8",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>▦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.navy, fontSize: 16, fontWeight: "900" }}>
              Install StudySpace
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
              Requested by Riley · iPhone
            </Text>
          </View>
        </View>
        <Text
          style={{ color: C.text, fontSize: 13, lineHeight: 20, marginTop: 18 }}
        >
          The child app is requesting permission to install a new learning app.
        </Text>
        <View
          style={{
            backgroundColor: "#F5F7FB",
            borderRadius: 12,
            padding: 12,
            marginTop: 14,
          }}
        >
          <Text style={{ color: C.muted, fontSize: 10, fontWeight: "800" }}>
            REQUEST DETAILS
          </Text>
          <Text style={{ color: C.navy, fontSize: 12, marginTop: 6 }}>
            Category: Education · Publisher: StudySpace Inc.
          </Text>
        </View>
        {requestStatus === "pending" ? (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => respond("denied")}
              style={{
                flex: 1,
                minHeight: 47,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}>
                Deny
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => respond("approved")}
              style={{
                flex: 1,
                minHeight: 47,
                borderRadius: 12,
                backgroundColor: C.blue,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.white, fontSize: 13, fontWeight: "800" }}>
                Approve
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => setRequestStatus("pending")}
            style={{
              marginTop: 17,
              minHeight: 45,
              borderRadius: 12,
              backgroundColor: "#EFF4FB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: C.blue, fontSize: 13, fontWeight: "800" }}>
              Reset preview request
            </Text>
          </Pressable>
        )}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            color: C.navy,
            fontSize: 16,
            fontWeight: "900",
            marginBottom: 9,
          }}
        >
          Review checklist
        </Text>
        <Text style={{ color: C.muted, fontSize: 12, lineHeight: 20 }}>
          Check the app name, category, publisher, and the child’s reason before
          making a decision. A connected backend should record the parent and
          decision time.
        </Text>
      </View>
    </Screen>
  );
}
