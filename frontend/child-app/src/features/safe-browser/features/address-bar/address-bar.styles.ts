/**
 * ============================================================================
 * Sub-Feature: Address Bar - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const addressBarStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: BROWSER_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: BROWSER_COLORS.border,
  },
  backAppBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BROWSER_COLORS.bg,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backAppText: {
    fontSize: 18,
    fontWeight: "700",
    color: BROWSER_COLORS.navy,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 12,
    backgroundColor: BROWSER_COLORS.bg,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    paddingHorizontal: 10,
    gap: 6,
  },
  lockIcon: {
    fontSize: 13,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BROWSER_COLORS.navy,
    paddingVertical: 4,
  },
  goBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: BROWSER_COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  goBtnText: {
    color: BROWSER_COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
});
