/**
 * ============================================================================
 * Route: /safe-browser-dashboard (Parent App)
 * ============================================================================
 * Thin Expo Router entrypoint for the Parent Safe Browser Control Dashboard.
 */

import React from "react";
import { SafeBrowserDashboardScreen } from "../../features/safe-browser-dashboard/SafeBrowserDashboardScreen";

export default function SafeBrowserDashboardRoute() {
  return <SafeBrowserDashboardScreen />;
}
