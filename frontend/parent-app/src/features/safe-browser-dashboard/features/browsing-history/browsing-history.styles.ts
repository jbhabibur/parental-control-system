/**
 * ============================================================================
 * Sub-Feature: Browsing History Section - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { C } from "../../../../components/ui";

export const browsingHistoryStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  filterChipActive: {
    borderColor: C.blue,
    backgroundColor: C.pale,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },
  filterChipTextActive: {
    color: C.blue,
  },
  itemRow: {
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  domain: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
  },
  url: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  timeText: {
    fontSize: 11,
    color: C.muted,
  },
  quickActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
  },
});
