/**
 * ============================================================================
 * Route: /alerts
 * ============================================================================
 * Thin Expo Router entrypoint for Safety & Tamper Alerts.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { AlertsScreen } from "../../features/alerts/AlertsScreen";

export default function AlertsRoute() {
  return <AlertsScreen />;
}
