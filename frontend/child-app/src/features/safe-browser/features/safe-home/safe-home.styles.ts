/**
 * ============================================================================
 * Sub-Feature: Safe Home View - Styles
 * ============================================================================
 */
import { StyleSheet } from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";

export const safeHomeStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: BROWSER_COLORS.bg,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 18,
  },
  heroBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: BROWSER_COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroIcon: {
    fontSize: 30,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: BROWSER_COLORS.navy,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: BROWSER_COLORS.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  policyPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  policyPill: {
    backgroundColor: BROWSER_COLORS.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  policyPillText: {
    color: BROWSER_COLORS.green,
    fontSize: 11,
    fontWeight: "800",
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BROWSER_COLORS.white,
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 42,
    paddingHorizontal: 10,
    fontSize: 14,
    color: BROWSER_COLORS.navy,
  },
  searchBtn: {
    backgroundColor: BROWSER_COLORS.blue,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    color: BROWSER_COLORS.white,
    fontWeight: "800",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
    marginBottom: 10,
    marginTop: 4,
  },
  approvedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  approvedChip: {
    backgroundColor: BROWSER_COLORS.white,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  approvedChipText: {
    color: BROWSER_COLORS.green,
    fontSize: 13,
    fontWeight: "700",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: "48%",
    backgroundColor: BROWSER_COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BROWSER_COLORS.navy,
  },
  quickDesc: {
    fontSize: 11,
    color: BROWSER_COLORS.muted,
    marginTop: 3,
  },
  requestCard: {
    backgroundColor: BROWSER_COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BROWSER_COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  requestDomain: {
    fontSize: 13,
    fontWeight: "700",
    color: BROWSER_COLORS.navy,
  },
  requestStatus: {
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
