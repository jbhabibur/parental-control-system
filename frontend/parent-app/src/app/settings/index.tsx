/**
 * ============================================================================
 * Route: /settings
 * ============================================================================
 * Thin Expo Router entrypoint for Parent Administrator Settings & Navigation.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { SettingsScreen } from "../../features/settings/SettingsScreen";

export default function SettingsRoute() {
  return <SettingsScreen />;
}
