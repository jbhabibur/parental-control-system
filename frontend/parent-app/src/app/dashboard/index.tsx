/**
 * ============================================================================
 * Route: /dashboard
 * ============================================================================
 * Thin Expo Router entrypoint for the Parent Home / Dashboard.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { HomeScreen } from "../../features/home/HomeScreen";

export default function DashboardRoute() {
  return <HomeScreen />;
}
