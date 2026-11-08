import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    // Temporary navigation for UI testing
    router.replace("/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>P</Text>
        </View>

        <Text style={styles.title}>Parent Control</Text>
        <Text style={styles.subtitle}>
          Securely manage and protect your child's device.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>

            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Parent Control System</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoContainer: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 22,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 38,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 9,
  },
  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 22,
  },
  forgot: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    height: 54,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  registerText: {
    color: "#64748B",
    fontSize: 14,
  },
  registerLink: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 45,
  },
});
