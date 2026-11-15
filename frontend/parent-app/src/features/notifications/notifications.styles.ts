/**
 * @file notifications.styles.ts
 * @description StyleSheet definitions for the Notifications feature.
 *
 * Responsibilities:
 *  1. Notification card container style (white card with border).
 *  2. Unread indicator dot style (small blue circle).
 *  3. Meta text styles (title, body preview, timestamp).
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const notificationsStyles = StyleSheet.create({
  // ── 1. Notification card ──────────────────────────────────────────────────
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 9,
  },

  // Row inside the card: title + unread dot
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  cardTitle: {
    flex: 1,
    color: C.navy,
    fontWeight: "800",
  },

  // ── 2. Unread indicator dot ───────────────────────────────────────────────
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.blue,
    marginTop: 4,
  },

  // ── 3. Body text & timestamp ──────────────────────────────────────────────
  cardBody: {
    color: C.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  cardTime: {
    color: C.muted,
    fontSize: 10,
    marginTop: 7,
  },

  // "Mark all read" action link (top-right)
  markAllBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  markAllText: {
    color: C.blue,
    fontWeight: "800",
  },

  // Empty-state label
  emptyText: {
    color: C.muted,
  },
});
