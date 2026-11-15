/**
 * @file NotificationsScreen.tsx
 * @description UI Component for the Notifications feature.
 *
 * Responsibilities:
 *  1. Header with title and "Mark all read" action.
 *  2. List of notification cards with unread dot indicator.
 *  3. Tap notification to view full alert details and mark as read.
 *  4. Empty and loading state rendering.
 */

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { notificationsStyles as styles } from "./notifications.styles";
import { useNotifications } from "./useNotifications";

export function NotificationsScreen() {
  const {
    items,
    loading,
    error,
    openNotification,
    markAllRead,
  } = useNotifications();

  return (
    <Screen>
      {/* ==================================================================== */}
      {/* 1. Header Section                                                    */}
      {/* ==================================================================== */}
      <PageHeader
        title="Notifications"
        subtitle="Messages for your parent account."
      />

      {/* ==================================================================== */}
      {/* 2. Top Actions ("Mark all read")                                     */}
      {/* ==================================================================== */}
      <Pressable
        onPress={() => void markAllRead()}
        style={styles.markAllBtn}
      >
        <Text style={styles.markAllText}>Mark all read</Text>
      </Pressable>

      {/* ==================================================================== */}
      {/* 3. Loading & Error States                                            */}
      {/* ==================================================================== */}
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red, marginBottom: 8 }}>
          {error}
        </Text>
      )}

      {/* ==================================================================== */}
      {/* 4. Empty State                                                       */}
      {/* ==================================================================== */}
      {!loading && !error && items.length === 0 && (
        <Text style={styles.emptyText}>No notifications.</Text>
      )}

      {/* ==================================================================== */}
      {/* 5. Notifications List                                                */}
      {/* ==================================================================== */}
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => void openNotification(item)}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {item.title || item.type || "Notification"}
            </Text>
            {!item.readAt && <View style={styles.unreadDot} />}
          </View>
          <Text numberOfLines={2} style={styles.cardBody}>
            {item.message || item.body || "Open to view details"}
          </Text>
          <Text style={styles.cardTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </Pressable>
      ))}
    </Screen>
  );
}

export default NotificationsScreen;
