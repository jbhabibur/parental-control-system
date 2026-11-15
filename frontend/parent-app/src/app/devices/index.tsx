/**
 * ============================================================================
 * Route: /devices
 * ============================================================================
 * Thin Expo Router entrypoint for Connected Devices & Pairing PIN/QR.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { DevicesScreen } from "../../features/devices/DevicesScreen";

export default function DevicesRoute() {
  return <DevicesScreen />;
}
