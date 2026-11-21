/**
 * ============================================================================
 * Sub-Feature: Domain Rules Section - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { C } from "../../../../components/ui";

export const domainRulesStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
  },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 3,
    marginBottom: 12,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.bg,
  },
  quickBtnsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  blockBtn: {
    flex: 1,
    backgroundColor: C.red,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  allowBtn: {
    flex: 1,
    backgroundColor: C.green,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  quickBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },
  starterBtn: {
    marginTop: 10,
    backgroundColor: C.pale,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  starterBtnText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: "800",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
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
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 8,
  },
  ruleDomain: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  ruleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: "800",
  },
  deleteBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.muted,
  },
  emptyText: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
  },
});
