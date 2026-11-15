/**
 * @file notifications.tsx
 * @description Route entry point for the Notifications feature.
 * Delegates rendering directly to `NotificationsScreen` in features/notifications.
 */

import { NotificationsScreen } from "../features/notifications/NotificationsScreen";

export default function NotificationsRoute() {
  return <NotificationsScreen />;
}
