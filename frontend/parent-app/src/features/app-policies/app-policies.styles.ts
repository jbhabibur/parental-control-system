/**
 * @file app-policies.styles.ts
 * @description StyleSheet definitions for the App Policies feature.
 *
 * Responsibilities:
 *  1. Device-selector horizontal chip styles (active / inactive).
 *  2. Policy card layout (name, badge, delete action).
 *  3. Decision badge (BLOCKED = red, ALLOWED = green).
 *  4. App-usage row style.
 *  5. Notice / disclaimer card style.
 *  6. Empty-state card style.
 *  7. Error banner style.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const appPoliciesStyles = StyleSheet.create({
  // ── 1. Device-selector chips ──────────────────────────────────────────────
  deviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  activeDeviceChip: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  deviceChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  activeDeviceChipText: {
    color: C.white,
  },

  // ── 2. Policy card ────────────────────────────────────────────────────────
  policyCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  policyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  // ── 3. Decision badge ─────────────────────────────────────────────────────
  decisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // ── 4. Usage row ──────────────────────────────────────────────────────────
  usageRow: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ── 5. Notice card ────────────────────────────────────────────────────────
  noticeCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 8,
    marginBottom: 24,
  },

  // ── 6. Empty-state card ───────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    alignItems: "center",
  },

  // ── 7. Error banner ───────────────────────────────────────────────────────
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  // Section title above each group
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.navy,
    marginBottom: 10,
  },
});
