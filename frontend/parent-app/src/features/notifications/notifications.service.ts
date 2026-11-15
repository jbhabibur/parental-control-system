/**
 * @file notifications.service.ts
 * @description Service layer for the Notifications feature.
 *
 * Responsibilities:
 *  1. Fetch the full list of notifications for the parent account.
 *  2. Fetch the full detail of a single notification.
 *  3. Mark a single notification as read.
 *  4. Mark ALL notifications as read in one request.
 *  5. Normalise unknown errors into human-readable strings.
 */

import { ApiError, api } from "../../services/api";

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape of a notification item returned by the backend list/detail endpoints. */
export type NotificationItem = {
  id: string;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  readAt?: string | null;
  createdAt: string;
  channel?: string;
  type?: string;
};

// ─── Service Object ──────────────────────────────────────────────────────────

/**
 * `notificationsService` — stateless API helpers for the notifications screen.
 * The hook (`useNotifications`) calls these and owns the resulting state.
 */
export const notificationsService = {
  /** Fetch all notifications. Returns an empty array when none exist. */
  async list(): Promise<NotificationItem[]> {
    const result = await api.notifications.list();
    return Array.isArray(result.data)
      ? (result.data as NotificationItem[])
      : [];
  },

  /** Fetch the full detail for a single notification by its `id`. */
  async get(id: string): Promise<NotificationItem | undefined> {
    const result = await api.notifications.get(id);
    return result.data as NotificationItem | undefined;
  },

  /** Mark a single notification as read by its `id`. */
  async markRead(id: string): Promise<void> {
    await api.notifications.markRead(id);
  },

  /** Mark ALL notifications in the parent account as read. */
  async markAllRead(): Promise<void> {
    await api.notifications.markAllRead();
  },

  /** Normalise an unknown thrown value into a plain string. */
  parseError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  },
};
