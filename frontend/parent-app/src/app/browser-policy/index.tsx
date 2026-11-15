/**
 * ============================================================================
 * Route: /browser-policy
 * ============================================================================
 * Thin Expo Router entrypoint for Web Protection & DNS Filtering.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { BrowserPolicyScreen } from "../../features/browser-policy/BrowserPolicyScreen";

export default function BrowserPolicyRoute() {
  return <BrowserPolicyScreen />;
}
