/**
 * ============================================================================
 * Feature: Activity - Style Definitions
 * ============================================================================
 * Visual styles for App Usage cards, Device Events feed, and Browsing History.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const activityStyles = StyleSheet.create({
  sectionTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 9,
  },
  usageCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
  },
  usageTitle: {
    color: C.navy,
    fontWeight: "800",
  },
  usageDetail: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  eventRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  eventTitle: {
    color: C.navy,
    fontWeight: "800",
    fontSize: 13,
  },
  eventSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  historyRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  historyTitle: {
    color: C.navy,
    fontWeight: "800",
    fontSize: 13,
  },
  historySubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  emptyNotice: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 14,
  },
});
