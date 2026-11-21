/**
 * ============================================================================
 * Sub-Feature: Pending Approval View - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const pendingApprovalStyles = StyleSheet.create({
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
    borderColor: "#FDE68A",
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BROWSER_COLORS.amberSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
    textAlign: "center",
  },
  domainPill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: BROWSER_COLORS.blueSoft,
  },
  domainText: {
    color: BROWSER_COLORS.blue,
    fontSize: 13,
    fontWeight: "800",
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: BROWSER_COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  waitingBox: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: BROWSER_COLORS.amberSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  waitingText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "700",
  },
  checkNowBtn: {
    width: "100%",
    marginTop: 18,
    backgroundColor: BROWSER_COLORS.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkNowBtnText: {
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
