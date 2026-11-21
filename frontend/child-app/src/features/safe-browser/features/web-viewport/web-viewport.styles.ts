/**
 * ============================================================================
 * Sub-Feature: Web Viewport - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const webViewportStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BROWSER_COLORS.white,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    backgroundColor: "rgba(37, 99, 235, 0.92)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  loadingText: {
    color: BROWSER_COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  webBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: BROWSER_COLORS.greenSoft,
    borderBottomWidth: 1,
    borderBottomColor: "#BBF7D0",
  },
  webBannerText: {
    fontSize: 12,
    fontWeight: "700",
    color: BROWSER_COLORS.green,
    flex: 1,
  },
  openExternalBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: BROWSER_COLORS.green,
  },
  openExternalText: {
    color: BROWSER_COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
});
