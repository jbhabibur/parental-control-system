import { Link, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { C, Card, Screen } from "../../components/ui";
import { api, clearTokens } from "../../lib/api";

export default function DashboardScreen() {
  const [parentName, setParentName] = useState("");
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.auth.parentMe(),
      api.devices.list(),
      api.permissionRequests.list(),
    ])
      .then(([profile, deviceResult, requestResult]) => {
        if (!active) return;
        const user = profile.user as { name?: string } | undefined;
        setParentName(user?.name || "");
        setDeviceCount(
          Array.isArray(deviceResult.data) ? deviceResult.data.length : 0,
        );
        const requests = Array.isArray(requestResult.data)
          ? (requestResult.data as Array<{ status?: string }>)
          : [];
        setPendingCount(
          requests.filter((item) => item.status === "PENDING").length,
        );
      })
      .catch(async () => {
        if (!active) return;
        await clearTokens("user");
        router.replace("/auth/login");
      });
    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    try {
      const { getRefreshToken } = await import("../../lib/api");
      const refreshToken = await getRefreshToken("user");
      if (refreshToken) await api.auth.logout(refreshToken);
    } catch {
      // Local logout still proceeds if the backend is unreachable.
    } finally {
      await clearTokens("user");
      router.replace("/auth/login");
    }
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <View>
          <Text
            style={{
              color: C.muted,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 1,
            }}
          >
            FAMILY SAFETY
          </Text>
          <Text
            style={{
              color: C.navy,
              fontSize: 28,
              fontWeight: "900",
              marginTop: 5,
            }}
          >
            {parentName ? `Hello, ${parentName}` : "Family overview"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Link href="/alerts" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View alerts"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: C.white,
                borderWidth: 1,
                borderColor: C.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.red, fontSize: 20, fontWeight: "900" }}>
                !
              </Text>
            </Pressable>
          </Link>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={() => void logout()}
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={{
                ios: "rectangle.portrait.and.arrow.right",
                android: "logout",
                web: "logout",
              }}
              tintColor={C.navy}
              size={20}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          backgroundColor: C.navy,
          borderRadius: 22,
          padding: 20,
          marginBottom: 22,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#C5D2E8", fontSize: 12, fontWeight: "700" }}>
            TODAY&apos;S OVERVIEW
          </Text>
          <View
            style={{
              backgroundColor: "#334563",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ color: "#DDE9FF", fontSize: 10, fontWeight: "800" }}>
              LIVE
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: C.white,
            fontSize: 19,
            fontWeight: "800",
            marginTop: 14,
          }}
        >
          {deviceCount === null
            ? "Loading devices..."
            : `${deviceCount} linked ${deviceCount === 1 ? "device" : "devices"}`}
        </Text>
        <Text style={{ color: "#C5D2E8", fontSize: 13, marginTop: 5 }}>
          Current parent account summary
        </Text>
        <View
          style={{ height: 1, backgroundColor: "#3D4B65", marginVertical: 17 }}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#C5D2E8", fontSize: 11 }}>SCREEN TIME</Text>
            <Text
              style={{
                color: C.white,
                fontSize: 25,
                fontWeight: "900",
                marginTop: 5,
              }}
            >
              {deviceCount ?? "—"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#C5D2E8", fontSize: 11 }}>LIMIT LEFT</Text>
            <Text
              style={{
                color: C.white,
                fontSize: 25,
                fontWeight: "900",
                marginTop: 5,
              }}
            >
              {pendingCount ?? "—"}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 7,
            borderRadius: 6,
            backgroundColor: "#3D4B65",
            marginTop: 17,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "58%",
              height: 7,
              backgroundColor: "#7CC7A4",
              borderRadius: 6,
            }}
          />
        </View>
        <Link href="/screen-time" asChild>
          <Pressable
            accessibilityRole="button"
            style={{ alignSelf: "flex-start", marginTop: 14 }}
          >
            <Text style={{ color: "#A8D9BE", fontSize: 13, fontWeight: "800" }}>
              View screen-time settings ›
            </Text>
          </Pressable>
        </Link>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 11,
        }}
      >
        <Text style={{ color: C.navy, fontSize: 18, fontWeight: "900" }}>
          Needs your attention
        </Text>
        <Link href="/permissions" asChild>
          <Pressable>
            <Text style={{ color: C.blue, fontSize: 12, fontWeight: "800" }}>
              See requests
            </Text>
          </Pressable>
        </Link>
      </View>
      <Link href="/permissions" asChild>
        <Pressable
          accessibilityRole="button"
          style={{
            backgroundColor: "#FFF9ED",
            borderColor: "#F4E4C1",
            borderWidth: 1,
            borderRadius: 16,
            padding: 15,
            marginBottom: 22,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              backgroundColor: "#F8E8C4",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>!</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.navy, fontWeight: "800", fontSize: 14 }}>
              1 permission request
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
              A request is waiting for your review
            </Text>
          </View>
          <Text style={{ color: C.muted, fontSize: 22 }}>›</Text>
        </Pressable>
      </Link>

      <Text
        style={{
          color: C.navy,
          fontSize: 18,
          fontWeight: "900",
          marginBottom: 11,
        }}
      >
        Manage your family
      </Text>
      <Card
        icon="▣"
        title="Child devices"
        subtitle="Device status and linked profiles"
        href="/devices"
      />
      <Card
        icon="◷"
        title="Activity"
        subtitle="App use and browsing summary"
        href="/activity"
      />
      <Card
        icon="⌕"
        title="Browser & DNS rules"
        subtitle="Web categories and safe search"
        href="/browser-policy"
      />
      <Card
        icon="!"
        title="Alerts"
        subtitle="Review safety events"
        href="/alerts"
      />
      <Card
        icon="⚙"
        title="Account & security"
        subtitle="Authentication and preferences"
        href="/settings"
      />
      <Text
        style={{
          color: C.muted,
          textAlign: "center",
          fontSize: 11,
          lineHeight: 17,
          marginTop: 9,
        }}
      >
        Values on this dashboard come from the connected backend.
      </Text>
    </Screen>
  );
}
