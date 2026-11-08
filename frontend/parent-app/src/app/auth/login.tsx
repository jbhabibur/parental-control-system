import { Link, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Button, C, Field, Screen } from "../../components/ui";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password.",
      );
      return;
    }
    // UI demo only. Real authentication will be connected to the backend later.
    router.replace("/dashboard");
  };

  return (
    <Screen>
      <View style={{ alignItems: "center", marginTop: 34, marginBottom: 34 }}>
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 24,
            backgroundColor: C.blue,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 38, fontWeight: "900" }}>
            P
          </Text>
        </View>
        <Text style={{ fontSize: 29, fontWeight: "900", color: C.navy }}>
          Welcome back
        </Text>
        <Text
          style={{
            color: C.muted,
            textAlign: "center",
            marginTop: 9,
            lineHeight: 21,
          }}
        >
          Sign in to manage your family’s digital safety.
        </Text>
      </View>

      <Field
        label="Email address"
        placeholder="name@example.com"
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
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            accessibilityState={{ selected: showPassword }}
            hitSlop={8}
            onPress={() => setShowPassword((visible) => !visible)}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={{
                ios: showPassword ? "eye.slash" : "eye",
                android: showPassword ? "visibility_off" : "visibility",
                web: showPassword ? "visibility_off" : "visibility",
              }}
              tintColor={C.muted}
              size={21}
            />
          </Pressable>
        }
      />

      <Link href="/auth/forgot-password" asChild>
        <Pressable style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <Text style={{ color: C.blue, fontWeight: "700" }}>
            Forgot password?
          </Text>
        </Pressable>
      </Link>
      <Button title="Sign In" onPress={handleLogin} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 26,
        }}
      >
        <Text style={{ color: C.muted }}>Don’t have an account? </Text>
        <Link href="/auth/register" asChild>
          <Pressable>
            <Text style={{ color: C.blue, fontWeight: "800" }}>
              Create account
            </Text>
          </Pressable>
        </Link>
      </View>
      <Text
        style={{
          textAlign: "center",
          color: "#A0AABC",
          fontSize: 11,
          marginTop: 46,
        }}
      >
        PARENT CONTROL SYSTEM • UI PREVIEW
      </Text>
    </Screen>
  );
}
