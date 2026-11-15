/**
 * ============================================================================
 * Feature: Permissions - Style Definitions
 * ============================================================================
 * Visual styles for permission requests list, hardware switches,
 * filter chips, and device selector carousel.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const permissionsStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 11,
  },
  activeTabButton: {
    backgroundColor: C.blue,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: C.muted,
  },
  activeTabButtonText: {
    color: C.white,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  activeFilterChip: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
  },
  activeFilterChipText: {
    color: C.white,
  },
  requestCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
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
  infoNotice: {
    backgroundColor: C.pale,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 16,
  },
  permRow: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
});
