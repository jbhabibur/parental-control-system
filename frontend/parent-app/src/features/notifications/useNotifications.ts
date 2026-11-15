/**
 * @file useNotifications.ts
 * @description State management hook for the Notifications feature.
 *
 * Responsibilities:
 *  1. Load the notifications list on mount (and on-demand via `reload`).
 *  2. Open a notification: fetch its detail, mark it read, then show an alert.
 *  3. Mark ALL notifications read in one action.
 *  4. Expose `loading` and `error` for feedback rendering.
 */

import { Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import {
  NotificationItem,
  notificationsService,
} from "./notifications.service";

// ─── Hook Return Shape ───────────────────────────────────────────────────────

export type UseNotificationsReturn = {
  /** All notifications from the backend. */
  items: NotificationItem[];
  /** True while any network request is in progress. */
  loading: boolean;
  /** Non-empty string when a request fails; empty string otherwise. */
  error: string;
  /** Fetch (or re-fetch) the notifications list from the server. */
  reload: () => Promise<void>;
  /** Open a notification: show its detail and mark it read. */
  openNotification: (item: NotificationItem) => Promise<void>;
  /** Mark every notification as read. */
  markAllRead: () => Promise<void>;
};

// ─── Hook Implementation ─────────────────────────────────────────────────────

/**
 * `useNotifications` — encapsulates all state and side-effects for the
 * Notifications screen. The screen component only calls this hook and
 * renders the returned data.
 */
export function useNotifications(): UseNotificationsReturn {
  // ── State ────────────────────────────────────────────────────────────────
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Action: Reload list ──────────────────────────────────────────────────

  /**
   * Fetches the latest notifications from the backend.
   * Called on mount (via useEffect) and after mutating operations.
   */
  const reload = useCallback(async () => {
    setError("");
    try {
      const data = await notificationsService.list();
      setItems(data);
    } catch (err: unknown) {
      setError(
        notificationsService.parseError(err, "Unable to load notifications."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Effect: Load on mount ────────────────────────────────────────────────
  useEffect(() => {
    void reload();
  }, [reload]);

  // ── Action: Open single notification ────────────────────────────────────

  /**
   * Fetches the full detail of `item`, marks it read (if not already),
   * refreshes the list, then shows an Alert with the content.
   */
  const openNotification = useCallback(
    async (item: NotificationItem) => {
      try {
        const detail = await notificationsService.get(item.id);
        // Mark read only if the notification has not been read yet
        if (!item.readAt) await notificationsService.markRead(item.id);
        await reload();
        Alert.alert(
          detail?.title ?? item.title ?? "Notification",
          detail?.message ?? detail?.body ?? item.message ?? item.body ?? "",
        );
      } catch (err: unknown) {
        Alert.alert(
          "Could not open notification",
          notificationsService.parseError(err, "Please try again."),
        );
      }
    },
    [reload],
  );

  // ── Action: Mark all read ────────────────────────────────────────────────

  /**
   * Sends the mark-all-read request to the backend, then refreshes the list.
   */
  const markAllRead = useCallback(async () => {
    try {
      await notificationsService.markAllRead();
      await reload();
    } catch (err: unknown) {
      Alert.alert(
        "Could not update notifications",
        notificationsService.parseError(err, "Please try again."),
      );
    }
  }, [reload]);

  // ── Return ────────────────────────────────────────────────────────────────
  return { items, loading, error, reload, openNotification, markAllRead };
}
