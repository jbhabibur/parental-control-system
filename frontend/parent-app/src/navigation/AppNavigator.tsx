/**
 * ============================================================================
 * Navigation: App Navigator Helper
 * ============================================================================
 * Provides navigation helper functions with type-safety for Expo Router.
 */

import { router, type Href } from "expo-router";
import { ROUTES } from "./navigation.types";

export const AppNavigator = {
  // Authentication Navigation
  goToLogin: () => router.replace(ROUTES.Login),
  goToRegister: () => router.push(ROUTES.Register),
  goToForgotPassword: () => router.push(ROUTES.ForgotPassword),

  // Main Dashboard
  goToDashboard: () => router.replace(ROUTES.Dashboard),

  // Features Navigation
  goToDevices: () => router.push(ROUTES.Devices),
  goToScreenTime: () => router.push(ROUTES.ScreenTime),
  goToBrowserPolicy: () => router.push(ROUTES.BrowserPolicy),
  goToSafeBrowserDashboard: () =>
    router.push(ROUTES.SafeBrowserDashboard as Href),
  goToPermissions: () => router.push(ROUTES.Permissions),
  goToActivity: () => router.push(ROUTES.Activity),
  goToAlerts: () => router.push(ROUTES.Alerts),
  goToSettings: () => router.push(ROUTES.Settings),
  goToSecurity: () => router.push(ROUTES.Security),
  goToReports: () => router.push(ROUTES.Reports),
  goToLocation: () => router.push(ROUTES.Location),
  goToNotifications: () => router.push(ROUTES.Notifications),
  goToAppPolicies: () => router.push(ROUTES.AppPolicies),

  // Common Controls
  goBack: () => router.back(),
};
