import React from "react";
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform
} from "react-native";
import type { TextInputProps } from "react-native";
import { router, Link } from "expo-router";

export const C = {
  navy: "#14213D", blue: "#2563EB", pale: "#EFF6FF",
  bg: "#F5F7FB", white: "#FFFFFF", text: "#172033",
  muted: "#718096", border: "#E5EAF2", green: "#16A34A",
  orange: "#EA8A17", red: "#DC2626",
};

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.pageHeader}>
      <Pressable onPress={() => router.back()} style={s.back}>
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={s.pageTitle}>{title}</Text>
        {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

export function Button({ title, onPress, secondary = false }: {
  title: string; onPress: () => void; secondary?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[s.button, secondary && s.secondaryButton]}>
      <Text style={[s.buttonText, secondary && s.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9AA5B5"
        style={s.input}
        autoCapitalize={props.keyboardType === "email-address" ? "none" : props.autoCapitalize}
        {...props}
      />
    </View>
  );
}

export function Card({ title, subtitle, icon, href, right }: {
  title: string; subtitle: string; icon: string; href: string; right?: string;
}) {
  return (
    <Link href={href as any} asChild>
      <Pressable style={s.card}>
        <View style={s.cardIcon}><Text style={{ fontSize: 21 }}>{icon}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{title}</Text>
          <Text style={s.cardSubtitle}>{subtitle}</Text>
        </View>
        <Text style={s.cardRight}>{right || "›"}</Text>
      </Pressable>
    </Link>
  );
}

export function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statDetail}>{detail}</Text>
    </View>
  );
}

export function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

export const styles = s;

const s = StyleSheet.create({
  screen: { flexGrow: 1, padding: 22, paddingTop: 28, paddingBottom: 40 },
  pageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 13 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border },
  backText: { fontSize: 30, color: C.navy, lineHeight: 34, marginTop: -3 },
  pageTitle: { fontSize: 23, fontWeight: "800", color: C.navy },
  subtitle: { fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 19 },
  button: { height: 54, borderRadius: 15, backgroundColor: C.blue, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: C.white, fontSize: 15, fontWeight: "700" },
  secondaryButton: { backgroundColor: C.pale, borderWidth: 1, borderColor: "#D7E5FF" },
  secondaryButtonText: { color: C.blue },
  label: { color: C.text, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  input: { height: 52, borderRadius: 13, borderWidth: 1, borderColor: C.border, backgroundColor: C.white, paddingHorizontal: 15, fontSize: 15, color: C.text },
  card: { backgroundColor: C.white, borderRadius: 17, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: C.border, gap: 13 },
  cardIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: C.pale, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: C.navy, fontSize: 15, fontWeight: "700" },
  cardSubtitle: { color: C.muted, fontSize: 12, marginTop: 4, lineHeight: 17 },
  cardRight: { color: C.muted, fontSize: 26, paddingHorizontal: 4 },
  stat: { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, minWidth: 100 },
  statLabel: { color: C.muted, fontSize: 11, fontWeight: "600" },
  statValue: { color: C.navy, fontSize: 25, fontWeight: "800", marginTop: 8 },
  statDetail: { color: C.green, fontSize: 11, marginTop: 3 },
  infoRow: { backgroundColor: C.white, padding: 16, borderRadius: 13, borderWidth: 1, borderColor: C.border, flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  infoLabel: { color: C.muted, fontSize: 13 },
  infoValue: { color: C.navy, fontWeight: "700", fontSize: 13 },
});
