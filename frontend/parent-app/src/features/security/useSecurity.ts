/**
 * ============================================================================
 * Feature: Security - Custom Hook
 * ============================================================================
 * Manages:
 * 1. MFA / 2FA status, QR code secret generation, and verification
 * 2. 2FA disabling with password & TOTP code
 * 3. Biometrics lock preference
 * 4. Audit logs of recent security events
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../services/api";
import { useAuth } from "../../context/auth-context";
import {
  AuditLogEntry,
  securityService,
} from "./security.service";

export function useSecurity() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableOtp, setDisableOtp] = useState("");
  const [showDisableForm, setShowDisableForm] = useState(false);

  // Biometric preference
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const loadSecurityState = async () => {
    setError("");
    try {
      const state = await securityService.loadSecurityProfile();
      setMfaEnabled(state.mfaEnabled);
      setAuditLogs(state.auditLogs);
      setBiometricsEnabled(state.biometricsEnabled);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to load security profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSecurityState();
  }, []);

  const handleSetupMfa = async () => {
    setBusy(true);
    try {
      const res = await securityService.setupMfa();
      const setupData = res.data as
        | { qrCode?: string; secret?: string }
        | undefined;
      setMfaQrCode(setupData?.qrCode || "");
      setMfaSecret(setupData?.secret || "");
    } catch (err) {
      Alert.alert(
        "MFA Setup Failed",
        err instanceof ApiError ? err.message : "Could not initiate MFA setup.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEnableMfa = async () => {
    const cleanOtp = verifyOtp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit confirmation code.");
      return;
    }

    setBusy(true);
    try {
      await securityService.enableMfa(cleanOtp);
      Alert.alert(
        "Success",
        "Two-factor authentication is now active on your account.",
      );
      setMfaEnabled(true);
      setMfaQrCode("");
      setMfaSecret("");
      setVerifyOtp("");
      await loadSecurityState();
    } catch (err) {
      Alert.alert(
        "Verification Failed",
        err instanceof ApiError
          ? err.message
          : "Invalid code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!disablePassword || !disableOtp) {
      Alert.alert(
        "Missing Information",
        "Enter your password and current 6-digit code.",
      );
      return;
    }

    setBusy(true);
    try {
      await securityService.disableMfa(disablePassword, disableOtp.trim());
      Alert.alert("MFA Disabled", "Two-factor authentication has been removed.");
      setMfaEnabled(false);
      setShowDisableForm(false);
      setDisablePassword("");
      setDisableOtp("");
      await loadSecurityState();
    } catch (err) {
      Alert.alert(
        "Could Not Disable MFA",
        err instanceof ApiError ? err.message : "Verification failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const toggleBiometrics = async (val: boolean) => {
    setBiometricsEnabled(val);
    await securityService.setBiometrics(val);
  };

  return {
    user,
    loading,
    busy,
    error,
    mfaEnabled,
    mfaQrCode,
    mfaSecret,
    verifyOtp,
    setVerifyOtp,
    disablePassword,
    setDisablePassword,
    disableOtp,
    setDisableOtp,
    showDisableForm,
    setShowDisableForm,
    biometricsEnabled,
    auditLogs,
    handleSetupMfa,
    handleEnableMfa,
    handleDisableMfa,
    toggleBiometrics,
  };
}
