/**
 * ============================================================================
 * Feature: Browser Policy - Style Definitions
 * ============================================================================
 * Visual styles for DNS policy configurations, domain rules list,
 * category badges, and input controls.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const browserPolicyStyles = StyleSheet.create({
  deviceCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  inputLabel: {
    color: C.text,
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
    color: C.text,
    backgroundColor: C.white,
  },
  saveButton: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: C.white,
    fontWeight: "800",
  },
  sectionTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 11,
  },
  addRuleCard: {
    marginTop: 13,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    gap: 9,
  },
  actionToggleRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  actionToggleButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  addRuleButton: {
    minHeight: 42,
    borderRadius: 9,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
