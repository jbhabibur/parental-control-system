/**
 * ============================================================================
 * Feature: Auth - Style Definitions
 * ============================================================================
 * Visual styles for Login, Registration, and Password Reset screens.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const authStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  headerIcon: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "900",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: C.navy,
  },
  headerSubtitle: {
    color: C.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  forgotPasswordLink: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  infoBanner: {
    backgroundColor: C.pale,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D7E5FF",
  },
  infoBannerTitle: {
    color: C.blue,
    fontWeight: "800",
    fontSize: 15,
  },
  infoBannerSubtitle: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    color: C.text,
    fontSize: 12,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: C.muted,
    fontSize: 14,
  },
  footerLink: {
    color: C.blue,
    fontWeight: "800",
    fontSize: 14,
  },
  eyeButton: {
    padding: 10,
  },
  eyeButtonText: {
    color: C.blue,
    fontWeight: "700",
    fontSize: 13,
  },
});
