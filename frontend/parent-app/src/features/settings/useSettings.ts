/**
 * ============================================================================
 * Feature: Settings - Custom Hook
 * ============================================================================
 * Manages:
 * 1. Administrator profile from auth context
 * 2. Backend health status monitoring
 * 3. Notification, biometric, and dark theme preferences
 * 4. Sign-out confirmation dialogue and session cleanup
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/auth-context";
import { settingsService } from "./settings.service";

export function useSettings() {
  const { user, logout } = useAuth();

  const [healthStatus, setHealthStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);
  const [busyLogout, setBusyLogout] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const prefs = await settingsService.loadPreferences();
        if (!active) return;
        setHealthStatus(prefs.healthStatus);
        setBioEnabled(prefs.bioEnabled);
        setPushEnabled(prefs.pushEnabled);
        setDarkMode(prefs.darkMode);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const togglePush = async (val: boolean) => {
    setPushEnabled(val);
    await settingsService.savePreference("parent-control.pref.push", val);
  };

  const toggleBio = async (val: boolean) => {
    setBioEnabled(val);
    await settingsService.savePreference("parent-control.pref.biometric", val);
  };

  const toggleDark = async (val: boolean) => {
    setDarkMode(val);
    await settingsService.savePreference("parent-control.pref.dark", val);
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your parent account? Active monitoring policies will continue running on connected child devices.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setBusyLogout(true);
            try {
              await logout();
              router.replace("/auth/login");
            } catch {
              router.replace("/auth/login");
            } finally {
              setBusyLogout(false);
            }
          },
        },
      ],
    );
  };

  return {
    user,
    healthStatus,
    loading,
    busyLogout,
    pushEnabled,
    bioEnabled,
    darkMode,
    togglePush,
    toggleBio,
    toggleDark,
    confirmSignOut,
  };
}
