/**
 * ============================================================================
 * Sub-Feature: DNS Protection Section - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { C } from "../../../../components/ui";

export const dnsProtectionStyles = StyleSheet.create({
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
  },
  switchHint: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.pale,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.blue,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: C.text,
    backgroundColor: C.bg,
    marginTop: 8,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: C.blue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },
});
