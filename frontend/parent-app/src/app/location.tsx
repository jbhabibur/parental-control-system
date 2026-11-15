/**
 * @file location.tsx
 * @description Route entry point for the Location feature.
 * Delegates rendering directly to `LocationScreen` in features/location.
 */

import { LocationScreen } from "../features/location/LocationScreen";

export default function LocationRoute() {
  return <LocationScreen />;
}
