/**
 * ============================================================================
 * Feature: Settings - Style Definitions
 * ============================================================================
 * Visual styles for Profile summary card, Navigation hub rows,
 * preferences switches, and sign-out button.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const settingsStyles = StyleSheet.create({
  profileCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
  },
  rolePill: {
    backgroundColor: C.pale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sectionHeader: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
  },
  navRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  switchRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  switchLabel: {
    color: C.navy,
    fontSize: 14,
    fontWeight: "800",
  },
  switchSub: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2,
  },
  infoLine: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logoutButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FFF1F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
});
