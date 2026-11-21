/**
 * ============================================================================
 * Sub-Feature: Blocked View - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const blockedViewStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: BROWSER_COLORS.bg,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: BROWSER_COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BROWSER_COLORS.redSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 34,
  },
  title: {
    fontSize: 21,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
    textAlign: "center",
  },
  domainPill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: BROWSER_COLORS.redSoft,
  },
  domainText: {
    color: BROWSER_COLORS.red,
    fontSize: 13,
    fontWeight: "800",
  },
  categoryBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: BROWSER_COLORS.amber,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: BROWSER_COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  reasonInput: {
    width: "100%",
    marginTop: 16,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: BROWSER_COLORS.navy,
    backgroundColor: BROWSER_COLORS.bg,
  },
  requestBtn: {
    width: "100%",
    marginTop: 14,
    backgroundColor: BROWSER_COLORS.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  requestBtnText: {
    color: BROWSER_COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  homeBtn: {
    width: "100%",
    marginTop: 10,
    backgroundColor: BROWSER_COLORS.bg,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  homeBtnText: {
    color: BROWSER_COLORS.navy,
    fontSize: 14,
    fontWeight: "700",
  },
});
