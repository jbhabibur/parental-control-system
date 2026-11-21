/**
 * ============================================================================
 * Feature: Home (Dashboard) - Style Definitions
 * ============================================================================
 * Contains all visual StyleSheet rules for the Home/Dashboard components:
 * 1. Header & user greeting
 * 2. Daily Child Screen Time & App Usage Control Card (First Section)
 * 3. Primary KPI metrics & stats
 * 4. Screen time trend charts
 * 5. Quick action cards
 * 6. Recent security event feeds
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const homeStyles = StyleSheet.create({
  // ── 1. Header & Greeting ──────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingTop: 6,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  // ── 2. Daily Child Screen Time Limit Section (FIRST SECTION) ─────────────
  dailyLimitCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  limitCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  limitCardTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  limitCardSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: C.pale,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.blue,
  },

  // Device chips inside Daily Limit Card
  deviceChipsScroll: {
    marginBottom: 14,
  },
  deviceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  activeDeviceChip: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  deviceChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.navy,
  },
  activeDeviceChipText: {
    color: C.white,
  },

  // Steppers: Hours & Minutes selectors
  steppersContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  stepperBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    alignItems: "center",
  },
  stepperLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  stepperControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnText: {
    color: C.navy,
    fontSize: 18,
    fontWeight: "900",
  },
  stepperValueText: {
    fontSize: 20,
    fontWeight: "900",
    color: C.navy,
    minWidth: 42,
    textAlign: "center",
  },

  // Quick Preset Chips (e.g. 1h, 1.5h, 2h, 3h)
  presetContainer: {
    marginBottom: 14,
  },
  presetLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: C.border,
  },
  presetChipActive: {
    backgroundColor: C.pale,
    borderColor: C.blue,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.navy,
  },
  presetChipTextActive: {
    color: C.blue,
  },

  // Save Limit Primary Button
  saveLimitBtn: {
    backgroundColor: C.blue,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveLimitBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "900",
  },

  // App-specific limit collapsible area
  appLimitToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  appLimitToggleText: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "800",
  },
  appLimitForm: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  appLimitInput: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: C.navy,
    marginBottom: 8,
  },
  appLimitSubmitBtn: {
    backgroundColor: C.navy,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  appLimitSubmitText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "800",
  },

  // ── 3. Screen Time Chart Card ─────────────────────────────────────────────
  chartCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chartBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  barBackground: {
    width: 24,
    height: 85,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  chartDayLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
    marginTop: 6,
  },

  // ── 4. Section Titles & Row ──────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    marginBottom: 10,
  },
  alertRow: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
