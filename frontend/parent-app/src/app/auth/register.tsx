/**
 * ============================================================================
 * Route: /auth/register
 * ============================================================================
 * Thin Expo Router entrypoint for Parent Administrator Account Registration.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { RegisterScreen } from "../../features/auth/RegisterScreen";

export default function RegisterRoute() {
  return <RegisterScreen />;
}
