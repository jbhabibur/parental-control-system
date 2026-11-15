/**
 * @file location.styles.ts
 * @description StyleSheet definitions for the Location feature.
 *
 * Responsibilities:
 *  1. Device-selector pill styles (active / inactive states).
 *  2. "Latest point" summary card style (dark navy card).
 *  3. History row separator style.
 *  4. Disclaimer text note at the bottom.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const locationStyles = StyleSheet.create({
  // ── 1. Device selector pills ──────────────────────────────────────────────
  devicePill: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 7,
  },
  devicePillActive: {
    borderColor: C.blue,
    backgroundColor: C.pale,
  },
  devicePillLabel: {
    color: C.navy,
    fontWeight: "800",
  },

  // ── 2. Latest-point card ──────────────────────────────────────────────────
  latestCard: {
    backgroundColor: C.navy,
    borderRadius: 13,
    padding: 15,
    marginTop: 10,
    marginBottom: 18,
  },
  latestCardTitle: {
    color: C.white,
    fontWeight: "900",
  },
  latestCardCoords: {
    color: C.white,
    marginTop: 8,
  },
  latestCardTime: {
    color: "#C5D2E8",
    fontSize: 11,
    marginTop: 6,
  },

  // ── 3. History row ────────────────────────────────────────────────────────
  historyRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  historyRowCoords: {
    color: C.text,
    fontWeight: "700",
  },
  historyRowTime: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },

  // ── 4. Section / metadata labels ─────────────────────────────────────────
  sectionTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 15,
  },
  emptyText: {
    color: C.muted,
    marginTop: 10,
  },
});
