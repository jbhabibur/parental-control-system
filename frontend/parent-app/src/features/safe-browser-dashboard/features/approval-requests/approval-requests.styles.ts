/**
 * ============================================================================
 * Sub-Feature: Approval Requests Section - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { C } from "../../../../components/ui";

export const approvalRequestsStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
  },
  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "800",
  },
  item: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 10,
  },
  domain: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
  },
  meta: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
  },
  reason: {
    fontSize: 12,
    color: C.text,
    marginTop: 6,
    fontStyle: "italic",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: C.green,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  denyBtn: {
    flex: 1,
    backgroundColor: C.red,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 13,
    color: C.muted,
  },
});
