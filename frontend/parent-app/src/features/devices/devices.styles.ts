/**
 * ============================================================================
 * Feature: Devices - Style Definitions
 * ============================================================================
 * Contains styles for:
 * 1. Enrollment card and pairing PIN container
 * 2. QR code canvas wrapper
 * 3. Connected device list cards and status badges
 * 4. Action buttons (Pause, Lock, Unlink)
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const devicesStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  generateButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: C.blue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  pairingCodeBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: C.pale,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
  },
  pairingCodeText: {
    fontSize: 34,
    fontWeight: "900",
    color: C.navy,
    letterSpacing: 6,
  },
  copyBtn: {
    backgroundColor: C.blue,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
  },
  instructionsContainer: {
    marginTop: 10,
    alignSelf: "stretch",
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 10,
  },
  instructionStep: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 20,
  },
  deviceCard: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  subLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subLinkText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});
