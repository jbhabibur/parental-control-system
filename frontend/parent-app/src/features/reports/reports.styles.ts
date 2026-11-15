/**
 * ============================================================================
 * Feature: Reports - Style Definitions
 * ============================================================================
 * Visual styles for device filters, time range tabs, bar charts,
 * and metric rows.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const reportsStyles = StyleSheet.create({
  subHeader: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  activeChipText: {
    color: C.white,
  },
  rangeRow: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 8,
  },
  activeRangeBtn: {
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  rangeBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },
  activeRangeBtnText: {
    color: C.navy,
    fontWeight: "800",
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  chartCol: {
    alignItems: "center",
    flex: 1,
  },
  barSlot: {
    width: 22,
    height: 80,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 5,
  },
  dayLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
    marginTop: 6,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: C.pale,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});
