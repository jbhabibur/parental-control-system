/**
 * ============================================================================
 * Feature: Auth - RegisterScreen UI Component
 * ============================================================================
 * Visual presentation for Parent Administrator Account Registration.
 * Supports:
 * 1. Full name, email address inputs
 * 2. Password & Confirm password fields with independent Show/Hide eye buttons
 * 3. Terms of Service & Parental Consent toggle
 * 4. Submit button with backend API account registration
 * 5. Sign In link
 */

import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Link } from "expo-router";
import { Button, C, Field, PageHeader, Screen } from "../../components/ui";
import { useRegister } from "./useRegister";
import { authStyles } from "./auth.styles";

export function RegisterScreen() {
  const {
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
  } = useRegister();

  return (
    <Screen>
      <PageHeader
        title="Create Account"
        subtitle="Set up your parent administrator account"
      />

      {/* Administrator Role Info Banner */}
      <View style={authStyles.infoBanner}>
        <Text style={authStyles.infoBannerTitle}>
          🛡️ Family Protection Administrator
        </Text>
        <Text style={authStyles.infoBannerSubtitle}>
          As the parent administrator, you will manage connected devices, enforce screen time rules, and supervise web activity.
        </Text>
      </View>

      {/* Full Name */}
      <Field
        label="Full Name"
        placeholder="Parent or Guardian Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      {/* Email Address */}
      <Field
        label="Email Address"
        placeholder="parent@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password with Eye Show/Hide */}
      <Field
        label="Password (min 8 characters)"
        placeholder="Create a strong password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            onPress={() => setShowPassword((prev) => !prev)}
            style={authStyles.eyeButton}
          >
            <Text style={authStyles.eyeButtonText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        }
      />

      {/* Confirm Password with Eye Show/Hide */}
      <Field
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry={!showConfirm}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showConfirm ? "Hide password" : "Show password"
            }
            onPress={() => setShowConfirm((prev) => !prev)}
            style={authStyles.eyeButton}
          >
            <Text style={authStyles.eyeButtonText}>
              {showConfirm ? "Hide" : "Show"}
            </Text>
          </Pressable>
        }
      />

      {/* Parental Consent Agreement */}
      <View style={authStyles.termsRow}>
        <Switch
          value={agreed}
          onValueChange={setAgreed}
          trackColor={{ false: "#CBD5E1", true: C.blue }}
          thumbColor={C.white}
        />
        <Text style={authStyles.termsText}>
          I agree to the Terms of Service and consent to parental device monitoring for my children.
        </Text>
      </View>

      {/* Submit Registration Button */}
      <Button
        title={busy ? "Creating Account..." : "Create Parent Account"}
        disabled={busy}
        onPress={() => void handleRegister()}
      />

      {/* Link back to Sign In */}
      <View style={authStyles.footerRow}>
        <Text style={authStyles.footerText}>Already have an account? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={authStyles.footerLink}>Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

export default RegisterScreen;
