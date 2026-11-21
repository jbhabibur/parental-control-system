/**
 * ============================================================================
 * Sub-Feature: Browser Toolbar - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const browserToolbarStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: BROWSER_COLORS.white,
    borderTopWidth: 1,
    borderTopColor: BROWSER_COLORS.border,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  icon: {
    fontSize: 18,
    color: BROWSER_COLORS.navy,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: BROWSER_COLORS.muted,
    marginTop: 2,
  },
});
