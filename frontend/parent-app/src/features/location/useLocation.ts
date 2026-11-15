/**
 * @file useLocation.ts
 * @description State management hook for the Location feature.
 *
 * Responsibilities:
 *  1. Load the list of connected devices on mount.
 *  2. Auto-select the first device once the device list is ready.
 *  3. Load the latest GPS fix and full history whenever `deviceId` changes.
 *  4. Expose a `selectDevice` action for the UI device-picker.
 *  5. Expose `loading` and `error` for feedback rendering.
 */

import { useEffect, useState } from "react";
import {
  DeviceOption,
  LocationPoint,
  locationService,
} from "./location.service";

// ─── Hook Return Shape ───────────────────────────────────────────────────────

export type UseLocationReturn = {
  /** All devices linked to the parent account. */
  devices: DeviceOption[];
  /** The currently selected device ID (empty string = none selected). */
  deviceId: string;
  /** Most-recent GPS fix for the selected device, or null if unavailable. */
  latest: LocationPoint | null;
  /** Historical breadcrumb trail for the selected device. */
  history: LocationPoint[];
  /** True while any network request is in progress. */
  loading: boolean;
  /** Non-empty string when a request fails; empty string on success. */
  error: string;
  /** Callback: select a different device by its ID. */
  selectDevice: (id: string) => void;
};

// ─── Hook Implementation ─────────────────────────────────────────────────────

/**
 * `useLocation` — encapsulates all state and side-effects for the
 * Location screen. The screen component only calls this hook and renders
 * the returned data.
 */
export function useLocation(): UseLocationReturn {
  // ── State ────────────────────────────────────────────────────────────────
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [latest, setLatest] = useState<LocationPoint | null>(null);
  const [history, setHistory] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Effect 1: Load devices on mount ─────────────────────────────────────
  useEffect(() => {
    let active = true;

    void locationService
      .listDevices()
      .then((entries) => {
        if (!active) return;
        setDevices(entries);
        // Auto-select the first device so the map/history loads immediately
        setDeviceId(entries[0]?.id ?? "");
      })
      .catch((err: unknown) => {
        if (active)
          setError(locationService.parseError(err, "Unable to load devices."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ── Effect 2: Reload location data when deviceId changes ─────────────────
  useEffect(() => {
    if (!deviceId) return;

    let active = true;
    setLoading(true);
    setError("");

    void Promise.all([
      locationService.getCurrentLocation(deviceId),
      locationService.getHistory(deviceId),
    ])
      .then(([currentPoint, historyPoints]) => {
        if (!active) return;
        setLatest(currentPoint);
        setHistory(historyPoints);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            locationService.parseError(err, "Unable to load location data."),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deviceId]);

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Select a device; triggers a fresh location data load via Effect 2. */
  const selectDevice = (id: string) => setDeviceId(id);

  // ── Return ────────────────────────────────────────────────────────────────
  return { devices, deviceId, latest, history, loading, error, selectDevice };
}
