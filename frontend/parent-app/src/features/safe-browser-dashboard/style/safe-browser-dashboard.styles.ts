/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - Main Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { C } from "../../../components/ui";

export const safeBrowserDashboardStyles = StyleSheet.create({
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  liveLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  refreshLink: {
    fontSize: 12,
    fontWeight: "800",
    color: C.blue,
  },
  liveAlertBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  liveAlertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: C.navy,
  },
  liveAlertBody: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  dismissText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.blue,
  },
  devicePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  devicePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  devicePillActive: {
    borderColor: C.blue,
    backgroundColor: C.pale,
  },
  devicePillText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
  },
  devicePillTextActive: {
    color: C.blue,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  errorText: {
    color: C.red,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    lineHeight: 19,
  },
});
