/**
 * ============================================================================
 * Feature: Screen Time - Style Definitions
 * ============================================================================
 * Visual styles for device selector, policy configuration card,
 * per-app quota limits, and pause command buttons.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const screenTimeStyles = StyleSheet.create({
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
  policyHeaderRow: {
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
  appLimitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 11,
  },
  addLimitCard: {
    marginTop: 13,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    gap: 9,
  },
  addLimitInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    padding: 10,
    color: C.text,
    backgroundColor: C.white,
  },
  addLimitButton: {
    minHeight: 42,
    borderRadius: 9,
    backgroundColor: C.pale,
    alignItems: "center",
    justifyContent: "center",
  },
  pauseButton: {
    marginTop: 18,
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
  },
});
