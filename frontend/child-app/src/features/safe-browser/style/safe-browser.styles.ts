/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - Main Layout Styles
 * ============================================================================
 * Shared palette and main screen layout styles for Child Safe Browser.
 */

import { StyleSheet } from "react-native";

export const BROWSER_COLORS = {
  navy: "#1E293B",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  muted: "#64748B",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  red: "#DC2626",
  redSoft: "#FEE2E2",
};

export const safeBrowserStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BROWSER_COLORS.bg,
  },
  statusStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: BROWSER_COLORS.navy,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    color: "#93C5FD",
    fontSize: 11,
    fontWeight: "700",
  },
  viewportContainer: {
    flex: 1,
    backgroundColor: BROWSER_COLORS.white,
  },
  checkingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: BROWSER_COLORS.bg,
  },
  checkingTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
  },
  checkingSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: BROWSER_COLORS.muted,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: BROWSER_COLORS.bg,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    color: BROWSER_COLORS.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 18,
    backgroundColor: BROWSER_COLORS.blue,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    color: BROWSER_COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
