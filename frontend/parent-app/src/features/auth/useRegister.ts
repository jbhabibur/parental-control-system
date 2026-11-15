/**
 * ============================================================================
 * Feature: Auth - useRegister Hook
 * ============================================================================
 * Manages parent registration form state, validation, password toggles,
 * parental consent agreements, and account creation API calls.
 */

import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { ApiError } from "../../services/api";
import { ParentUser, useAuth } from "../../context/auth-context";
import { authService } from "./auth.service";

export function useRegister() {
  const { loginSuccess } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (busy) return;

    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      Alert.alert(
        "Invalid Name",
        "Name must be between 2 and 100 characters.",
      );
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters and no more than 72 characters.",
      );
      return;
    }

    if (password !== confirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    if (!agreed) {
      Alert.alert(
        "Consent Required",
        "Please accept the Terms of Service & Parental Consent to proceed.",
      );
      return;
    }

    setBusy(true);
    try {
      const result = await authService.register({
        name: trimmedName,
        email: email.trim().toLowerCase(),
        password,
      });

      if (
        !result.user ||
        typeof result.accessToken !== "string" ||
        typeof result.refreshToken !== "string"
      ) {
        throw new Error(
          "The server did not return a valid account session.",
        );
      }

      await loginSuccess(result.user as ParentUser, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      Alert.alert(
        "Welcome!",
        "Your parent account has been successfully created.",
      );
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    agreed,
    setAgreed,
    busy,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    handleRegister,
  };
}
