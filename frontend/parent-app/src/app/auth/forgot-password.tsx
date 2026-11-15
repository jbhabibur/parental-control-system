/**
 * ============================================================================
 * Route: /auth/forgot-password
 * ============================================================================
 * Thin Expo Router entrypoint for Account Password Reset Recovery.
 * Delegates directly to the modularized feature screen.
 */

import React from "react";
import { ForgotPasswordScreen } from "../../features/auth/ForgotPasswordScreen";

export default function ForgotPasswordRoute() {
  return <ForgotPasswordScreen />;
}
