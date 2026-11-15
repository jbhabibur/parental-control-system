/**
 * ============================================================================
 * Feature: Auth - LoginScreen UI Component
 * ============================================================================
 * Visual presentation for Parent Administrator Sign In.
 * Supports:
 * 1. Standard email & password credentials entry
 * 2. Show/Hide password toggle
 * 3. 2FA (MFA) challenge code verification screen with countdown
 * 4. Links to Forgot Password & Registration
 */

import React from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Button, C, Field, Screen } from "../../components/ui";
import { useLogin } from "./useLogin";
import { authStyles } from "./auth.styles";

export function LoginScreen() {
  const {
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
  } = useLogin();

  return (
    <Screen>
      <View style={authStyles.container}>
        {/* Header Icon & Title */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={authStyles.headerIconWrapper}>
            <Text style={authStyles.headerIcon}>🛡️</Text>
          </View>

          <Text style={authStyles.headerTitle}>
            {challengeToken ? "Two-Factor Auth" : "Welcome Back"}
          </Text>
          <Text style={authStyles.headerSubtitle}>
            {challengeToken
              ? `Enter the 6-digit code from your authenticator app. Code expires in ${formatCountdown(countdown)}.`
              : "Sign in to manage your family's digital safety and device policies."}
          </Text>
        </View>

        {!challengeToken ? (
          <>
            {/* Email Field */}
            <Field
              label="Email address"
              placeholder="parent@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Field with Show/Hide toggle */}
            <Field
              label="Password"
              placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <View style={authStyles.forgotPasswordLink}>
              <Link href="/auth/forgot-password" asChild>
                <Pressable>
                  <Text
                    style={{
                      color: C.blue,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    Forgot password?
                  </Text>
                </Pressable>
              </Link>
            </View>
          </>
        ) : (
          /* MFA Challenge Code Field */
          <View style={{ marginBottom: 20 }}>
            <Field
              label="Authenticator Code"
              placeholder="123456"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>
        )}

        {/* Submit Button */}
        <Button
          title={
            busy
              ? "Verifying..."
              : challengeToken
                ? "Verify Security Code"
                : "Sign In as Parent"
          }
          disabled={busy}
          onPress={() => void handleLogin()}
        />

        {/* Cancel MFA Challenge Button */}
        {!!challengeToken && (
          <View style={{ marginTop: 12 }}>
            <Button
              title="Cancel & Back to Login"
              secondary
              onPress={cancelMfaChallenge}
            />
          </View>
        )}

        {/* Create Account Link */}
        {!challengeToken && (
          <View style={authStyles.footerRow}>
            <Text style={authStyles.footerText}>Don't have an account? </Text>
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text style={authStyles.footerLink}>Create one</Text>
              </Pressable>
            </Link>
          </View>
        )}
      </View>
    </Screen>
  );
}

export default LoginScreen;
