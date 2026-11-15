/**
 * ============================================================================
 * Route: /screen-time
 * ============================================================================
 * Thin Expo Router entrypoint for Screen Time & Bedtime Limits.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { ScreenTimeScreen } from "../../features/screen-time/ScreenTimeScreen";

export default function ScreenTimeRoute() {
  return <ScreenTimeScreen />;
}
