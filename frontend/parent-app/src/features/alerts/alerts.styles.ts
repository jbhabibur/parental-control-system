/**
 * ============================================================================
 * Feature: Alerts - Style Definitions
 * ============================================================================
 * Visual styles for security alerts feed and indicator icons.
 */

import { StyleSheet } from "react-native";
import { C } from "../../components/ui";

export const alertsStyles = StyleSheet.create({
  alertCountText: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#F8E8E4",
    alignItems: "center",
    justifyContent: "center",
  },
  iconDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.orange,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.blue,
  },
  titleText: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
  },
  timestampText: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  descriptionText: {
    color: C.text,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
  },
  ackButton: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  ackButtonText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: "800",
  },
});
