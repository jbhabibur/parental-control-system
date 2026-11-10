import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../components/ui";
import { ApiError, api } from "../lib/api";

type NotificationItem = {
  id: string;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  readAt?: string | null;
  createdAt: string;
  channel?: string;
  type?: string;
};

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const result = await api.notifications.list();
      setItems(
        Array.isArray(result.data) ? (result.data as NotificationItem[]) : [],
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openNotification = async (item: NotificationItem) => {
    try {
      const result = await api.notifications.get(item.id);
      const detail = result.data as NotificationItem | undefined;
      if (!item.readAt) await api.notifications.markRead(item.id);
      await load();
      Alert.alert(
        detail?.title || item.title || "Notification",
        detail?.message || detail?.body || item.message || item.body || "",
      );
    } catch (requestError) {
      Alert.alert(
        "Could not open notification",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      await load();
    } catch (requestError) {
      Alert.alert(
        "Could not update notifications",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Notifications"
        subtitle="Messages for your parent account."
      />
      <Pressable
        onPress={() => void markAllRead()}
        style={{ alignSelf: "flex-end", paddingVertical: 8 }}
      >
        <Text style={{ color: C.blue, fontWeight: "800" }}>Mark all read</Text>
      </Pressable>
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red }}>
          {error}
        </Text>
      )}
      {!loading && !error && items.length === 0 && (
        <Text style={{ color: C.muted }}>No notifications.</Text>
      )}
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => void openNotification(item)}
          style={{
            backgroundColor: C.white,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            padding: 14,
            marginBottom: 9,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Text style={{ flex: 1, color: C.navy, fontWeight: "800" }}>
              {item.title || item.type || "Notification"}
            </Text>
            {!item.readAt && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: C.blue,
                  marginTop: 4,
                }}
              />
            )}
          </View>
          <Text
            numberOfLines={2}
            style={{
              color: C.text,
              fontSize: 12,
              lineHeight: 18,
              marginTop: 7,
            }}
          >
            {item.message || item.body || "Open to view details"}
          </Text>
          <Text style={{ color: C.muted, fontSize: 10, marginTop: 7 }}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </Pressable>
      ))}
    </Screen>
  );
}
