/**
 * ============================================================================
 * Feature: Auth - useLogin Hook
 * ============================================================================
 * Manages:
 * 1. Email and password form state
 * 2. Password show/hide toggle
 * 3. MFA challenge token & 5-minute countdown timer
 * 4. Two-factor authentication verification
 * 5. Session storage and dashboard redirection
 */

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { ApiError } from "../../services/api";
import { ParentUser, useAuth } from "../../context/auth-context";
import { authService } from "./auth.service";

export function useLogin() {
  const { loginSuccess } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // MFA Challenge State
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(300);

  // Countdown timer for MFA Challenge
  useEffect(() => {
    if (!challengeToken) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setChallengeToken(null);
          Alert.alert(
            "Challenge Expired",
            "The 5-minute MFA verification window has expired. Please sign in again.",
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeToken]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLogin = async () => {
    if (busy) return;

    if (!challengeToken) {
      // Step 1: Standard Email & Password Login
      if (!email.trim() || !password) {
        Alert.alert(
          "Missing Information",
          "Please enter your email and password.",
        );
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }

      setBusy(true);
      try {
        const result = await authService.login({
          email: email.trim().toLowerCase(),
          password,
        });

        // Check if MFA Challenge is required
        if (result.mfaRequired && typeof result.challengeToken === "string") {
          setChallengeToken(result.challengeToken);
          setCountdown(
            typeof result.expiresIn === "number" ? result.expiresIn : 300,
          );
          return;
        }

        if (
          !result.user ||
          typeof result.accessToken !== "string" ||
          typeof result.refreshToken !== "string"
        ) {
          throw new Error(
            "The server did not return a valid authentication session.",
          );
        }

        await loginSuccess(result.user as ParentUser, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        router.replace("/dashboard");
      } catch (error) {
        Alert.alert(
          "Authentication Failed",
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Invalid credentials.",
        );
      } finally {
        setBusy(false);
      }
    } else {
      // Step 2: MFA Challenge Verification
      const sanitizedCode = otpCode.replace(/\D/g, "");
      if (sanitizedCode.length !== 6) {
        Alert.alert(
          "Invalid Code",
          "Please enter the 6-digit verification code from your authenticator app.",
        );
        return;
      }

      setBusy(true);
      try {
        const result = await authService.verifyMfaLogin({
          challengeToken,
          code: sanitizedCode,
        });

        if (
          !result.user ||
          typeof result.accessToken !== "string" ||
          typeof result.refreshToken !== "string"
        ) {
          throw new Error(
            "The server did not return a valid authentication session.",
          );
        }

        await loginSuccess(result.user as ParentUser, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        router.replace("/dashboard");
      } catch (error) {
        Alert.alert(
          "Verification Failed",
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Invalid or expired verification code.",
        );
      } finally {
        setBusy(false);
      }
    }
  };

  const cancelMfaChallenge = () => {
    setChallengeToken(null);
    setOtpCode("");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    busy,
    challengeToken,
    otpCode,
    setOtpCode,
    countdown,
    formatCountdown,
    handleLogin,
    cancelMfaChallenge,
  };
}
