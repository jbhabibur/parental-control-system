/**
 * ============================================================================
 * Feature: Security - Style Definitions
 * ============================================================================
 * Visual styles for 2FA setup, QR code image, OTP inputs, and Audit log rows.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const securityStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: C.blue,
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primaryButtonText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  confirmButton: {
    backgroundColor: C.green,
    borderRadius: 10,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  qrContainer: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  otpInput: {
    height: 46,
    width: "100%",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    backgroundColor: C.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: 4,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    color: C.text,
    fontSize: 13,
    marginBottom: 8,
  },
  disableBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
});
