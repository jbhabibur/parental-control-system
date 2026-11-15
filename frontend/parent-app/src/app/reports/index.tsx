/**
 * ============================================================================
 * Route: /reports
 * ============================================================================
 * Thin Expo Router entrypoint for Analytics Reports & Usage Audits.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { ReportsScreen } from "../../features/reports/ReportsScreen";

export default function ReportsRoute() {
  return <ReportsScreen />;
}
