/**
 * ============================================================================
 * Route: /permissions
 * ============================================================================
 * Thin Expo Router entrypoint for Child Permission Requests & Hardware Rules.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { PermissionsScreen } from "../../features/permissions/PermissionsScreen";

export default function PermissionsRoute() {
  return <PermissionsScreen />;
}
