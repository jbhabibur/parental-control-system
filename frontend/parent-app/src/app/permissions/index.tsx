import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type PermissionRequest = {
  id: string;
  childId: string;
  deviceId: string;
  requestType: string;
  resource: string;
  reason?: string | null;
  status: string;
  createdAt: string;
};

export default function PermissionsScreen() {
  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setError("");
    try {
      const result = await api.permissionRequests.list();
      setRequests(
        Array.isArray(result.data) ? (result.data as PermissionRequest[]) : [],
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load permission requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const respond = async (
    item: PermissionRequest,
    decision: "approve" | "reject",
  ) => {
    setBusyId(item.id);
    try {
      if (decision === "approve") await api.permissionRequests.approve(item.id);
      else await api.permissionRequests.reject(item.id);
      await loadRequests();
    } catch (requestError) {
      Alert.alert(
        "Request update failed",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Permission requests"
        subtitle="Review access requests submitted by paired child devices."
      />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red, fontSize: 12 }}>
          {error}
        </Text>
      )}
      {!loading && !error && requests.length === 0 && (
        <Text style={{ color: C.muted, fontSize: 13 }}>
          No permission requests found.
        </Text>
      )}
      {requests.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: C.white,
            borderColor: C.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 15,
            marginBottom: 11,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Text style={{ color: C.navy, fontWeight: "900", flex: 1 }}>
              {item.requestType.replaceAll("_", " ")}
            </Text>
            <Text
              style={{
                color: item.status === "PENDING" ? C.orange : C.muted,
                fontSize: 11,
                fontWeight: "900",
              }}
            >
              {item.status}
            </Text>
          </View>
          <Text style={{ color: C.text, fontSize: 13, marginTop: 8 }}>
            {item.resource}
          </Text>
          <Text style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>
            Child {item.childId} · {new Date(item.createdAt).toLocaleString()}
          </Text>
          {!!item.reason && (
            <Text
              style={{
                color: C.text,
                fontSize: 12,
                lineHeight: 18,
                marginTop: 8,
              }}
            >
              {item.reason}
            </Text>
          )}
          {item.status === "PENDING" && (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 13 }}>
              <Pressable
                accessibilityRole="button"
                disabled={busyId === item.id}
                onPress={() => void respond(item, "reject")}
                style={{
                  flex: 1,
                  minHeight: 42,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: C.navy, fontWeight: "800" }}>
                  {busyId === item.id ? "Saving..." : "Deny"}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={busyId === item.id}
                onPress={() => void respond(item, "approve")}
                style={{
                  flex: 1,
                  minHeight: 42,
                  borderRadius: 10,
                  backgroundColor: C.blue,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: C.white, fontWeight: "800" }}>
                  {busyId === item.id ? "Saving..." : "Approve"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
      <Text
        style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 8 }}
      >
        Approval records the parent decision. The child operating system still
        needs its own permission enforcement.
      </Text>
    </Screen>
  );
}
