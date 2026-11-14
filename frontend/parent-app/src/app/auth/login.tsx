import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Button, C, Field, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";
import { ParentUser, useAuth } from "../../context/auth-context";

export default function LoginScreen() {
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
        const result = await api.auth.login({
          email: email.trim().toLowerCase(),
          password,
        });

        // Check if MFA Challenge is required
        if (result.mfaRequired && typeof result.challengeToken === "string") {
          setChallengeToken(result.challengeToken);
          setCountdown(typeof result.expiresIn === "number" ? result.expiresIn : 300);
          return;
        }

        if (
          !result.user ||
          typeof result.accessToken !== "string" ||
          typeof result.refreshToken !== "string"
        ) {
          throw new Error("The server did not return a valid authentication session.");
        }

        await loginSuccess(result.user as ParentUser, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        router.replace("/dashboard");
      } catch (error) {
        Alert.alert(
          "Sign In Failed",
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Unable to sign in. Please verify your credentials and network connection.",
        );
      } finally {
        setBusy(false);
      }
    } else {
      // Step 2: 2FA OTP Verification
      const cleanOtp = otpCode.replace(/\D/g, "");
      if (cleanOtp.length !== 6) {
        Alert.alert("Invalid OTP", "Please enter the 6-digit authenticator code.");
        return;
      }

      setBusy(true);
      try {
        const result = await api.auth.verifyMfaLogin({
          challengeToken,
          token: cleanOtp,
        });

        if (
          !result.user ||
          typeof result.accessToken !== "string" ||
          typeof result.refreshToken !== "string"
        ) {
          throw new Error("The server did not return a valid session for this MFA challenge.");
        }

        await loginSuccess(result.user as ParentUser, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        router.replace("/dashboard");
      } catch (error) {
        Alert.alert(
          "MFA Verification Failed",
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Invalid or expired one-time passcode.",
        );
      } finally {
        setBusy(false);
      }
    }
  };

  const cancelMfa = () => {
    setChallengeToken(null);
    setOtpCode("");
  };

  return (
    <Screen>
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 28 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            backgroundColor: C.navy,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 34, fontWeight: "900" }}>🛡️</Text>
        </View>

        <Text style={{ fontSize: 28, fontWeight: "900", color: C.navy }}>
          {challengeToken ? "Two-Factor Auth" : "Welcome Back"}
        </Text>
        <Text
          style={{
            color: C.muted,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 20,
            paddingHorizontal: 20,
          }}
        >
          {challengeToken
            ? `Enter the 6-digit code from your authenticator app. Code expires in ${formatCountdown(countdown)}.`
            : "Sign in to manage your family's digital safety and device policies."}
        </Text>
      </View>

      {!challengeToken ? (
        <>
          <Field
            label="Email address"
            placeholder="parent@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightAccessory={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            }
          />

          <View style={{ alignItems: "flex-end", marginBottom: 20 }}>
            <Link href="/auth/forgot-password" asChild>
              <Pressable>
                <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>
                  Forgot password?
                </Text>
              </Pressable>
            </Link>
          </View>
        </>
      ) : (
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text style={{ color: countdown < 60 ? C.red : C.muted, fontSize: 12, fontWeight: "700" }}>
              Time remaining: {formatCountdown(countdown)}
            </Text>
            <Pressable onPress={cancelMfa}>
              <Text style={{ color: C.blue, fontWeight: "700", fontSize: 13 }}>
                Back to credentials
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <Button
        title={
          busy
            ? "Please wait..."
            : challengeToken
              ? "Verify & Sign In"
              : "Sign In"
        }
        disabled={busy}
        onPress={() => void handleLogin()}
      />

      {!challengeToken && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 26,
            alignItems: "center",
          }}
        >
          <Text style={{ color: C.muted, fontSize: 14 }}>Don't have an account? </Text>
          <Link href="/auth/register" asChild>
            <Pressable>
              <Text style={{ color: C.blue, fontWeight: "800", fontSize: 14 }}>
                Create account
              </Text>
            </Pressable>
          </Link>
        </View>
      )}

      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Text style={{ color: "#9AA5B5", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
          PARENTAL CONTROL SYSTEM • SECURE ACCESS
        </Text>
      </View>
    </Screen>
  );
}
