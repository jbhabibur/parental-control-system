/**
 * ============================================================================
 * Navigation: Route Types & Path Definitions
 * ============================================================================
 * Strongly typed route definitions for Expo Router.
 * Helps prevent invalid navigation paths and provides clear auto-completion.
 */

export type AppRoutes = {
  // Authentication Routes
  Login: "/auth/login";
  Register: "/auth/register";
  ForgotPassword: "/auth/forgot-password";

  // Main Dashboard / Home
  Dashboard: "/dashboard";

  // Feature Screens
  Devices: "/devices";
  ScreenTime: "/screen-time";
  BrowserPolicy: "/browser-policy";
  SafeBrowserDashboard: "/safe-browser-dashboard";
  Permissions: "/permissions";
  Activity: "/activity";
  Alerts: "/alerts";
  Settings: "/settings";
  Security: "/security";
  Reports: "/reports";
  Location: "/location";
  Notifications: "/notifications";
  AppPolicies: "/app-policies";
};

export const ROUTES: AppRoutes = {
  Login: "/auth/login",
  Register: "/auth/register",
  ForgotPassword: "/auth/forgot-password",
  Dashboard: "/dashboard",
  Devices: "/devices",
  ScreenTime: "/screen-time",
  BrowserPolicy: "/browser-policy",
  SafeBrowserDashboard: "/safe-browser-dashboard",
  Permissions: "/permissions",
  Activity: "/activity",
  Alerts: "/alerts",
  Settings: "/settings",
  Security: "/security",
  Reports: "/reports",
  Location: "/location",
  Notifications: "/notifications",
  AppPolicies: "/app-policies",
};
