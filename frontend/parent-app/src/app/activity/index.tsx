/**
 * ============================================================================
 * Route: /activity
 * ============================================================================
 * Thin Expo Router entrypoint for Child Activity, App Usage, & Web History.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { ActivityScreen } from "../../features/activity/ActivityScreen";

export default function ActivityRoute() {
  return <ActivityScreen />;
}
