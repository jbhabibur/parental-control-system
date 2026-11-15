/**
 * ============================================================================
 * Route: /security
 * ============================================================================
 * Thin Expo Router entrypoint for Account Security Center & 2FA.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { SecurityScreen } from "../../features/security/SecurityScreen";

export default function SecurityRoute() {
  return <SecurityScreen />;
}
