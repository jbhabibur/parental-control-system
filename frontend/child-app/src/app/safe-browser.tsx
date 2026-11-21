/**
 * ============================================================================
 * Route: /safe-browser (Child App)
 * ============================================================================
 * Thin Expo Router entrypoint that delegates to the modular SafeBrowserScreen.
 */

import React from "react";
import { SafeBrowserScreen } from "../features/safe-browser/SafeBrowserScreen";

export default function SafeBrowserRoute() {
  return <SafeBrowserScreen />;
}
