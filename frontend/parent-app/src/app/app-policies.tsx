/**
 * @file app-policies.tsx
 * @description Route entry point for the Application Policies & Rules feature.
 * Delegates rendering directly to `AppPoliciesScreen` in features/app-policies.
 */

import { AppPoliciesScreen } from "../features/app-policies/AppPoliciesScreen";

export default function AppPoliciesRoute() {
  return <AppPoliciesScreen />;
}
