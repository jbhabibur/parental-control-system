/**
 * ============================================================================
 * Route: /auth/login
 * ============================================================================
 * Thin Expo Router entrypoint for Parent Administrator Sign In.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { LoginScreen } from "../../features/auth/LoginScreen";

export default function LoginRoute() {
  return <LoginScreen />;
}
