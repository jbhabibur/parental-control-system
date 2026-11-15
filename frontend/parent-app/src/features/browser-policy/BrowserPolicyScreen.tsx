/**
 * ============================================================================
 * Feature: Browser Policy - UI Component
 * ============================================================================
 * Visual presentation for DNS Filtering & Safe Web Supervision.
 * Displays:
 * 1. Device selection pills
 * 2. DNS policy master toggle, SafeSearch, DoH & DoT endpoints
 * 3. Domain rules (ALLOW/BLOCK) table with one-tap rule deletion
 * 4. Add domain rule input row with quick toggle between ALLOW / BLOCK
 * 5. Domain category management catalog with creation form
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { useBrowserPolicy } from "./useBrowserPolicy";
import { browserPolicyStyles } from "./browser-policy.styles";

export function BrowserPolicyScreen() {
  const {
    devices,
    deviceId,
    setDeviceId,
    policy,
    rules,
    categories,
    domain,
    setDomain,
    action,
    setAction,
    categoryName,
    setCategoryName,
    enabled,
    setEnabled,
    safeSearch,
    setSafeSearch,
    provider,
    setProvider,
    dohEndpoint,
    setDohEndpoint,
    dotEndpoint,
    setDotEndpoint,
    loading,
    error,
    savePolicy,
    addRule,
    deleteRule,
    addCategory,
    deleteCategory,
  } = useBrowserPolicy();

  return (
    <Screen>
      <PageHeader
        title="Browser & DNS"
        subtitle="Configure DNS policy and domain rules for a connected device."
      />

      {loading && <ActivityIndicator color={C.blue} />}

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}

      {devices.length === 0 && !loading && (
        <Text style={{ color: C.muted }}>
          Connect a child device before configuring web rules.
        </Text>
      )}

      {/* Device Selection */}
      {devices.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => setDeviceId(item.id)}
          style={[
            browserPolicyStyles.deviceCard,
            {
              borderColor: item.id === deviceId ? C.blue : C.border,
              backgroundColor: item.id === deviceId ? C.pale : C.white,
              marginBottom: 7,
            },
          ]}
        >
          <Text style={{ color: C.navy, fontWeight: "800" }}>
            {item.deviceName}
          </Text>
        </Pressable>
      ))}

      {!!deviceId && (
        <>
          {/* ================================================================ */}
          {/* 1. DNS Policy Configuration Card */}
          {/* ================================================================ */}
          <View style={browserPolicyStyles.card}>
            <View style={browserPolicyStyles.rowBetween}>
              <Text style={{ color: C.navy, fontWeight: "900" }}>
                DNS filtering enabled
              </Text>
              <Switch value={enabled} onValueChange={setEnabled} />
            </View>

            <View style={browserPolicyStyles.rowBetween}>
              <Text style={{ color: C.navy, fontWeight: "700" }}>
                SafeSearch
              </Text>
              <Switch value={safeSearch} onValueChange={setSafeSearch} />
            </View>

            <TextInput
              value={provider}
              onChangeText={setProvider}
              placeholder="Provider (optional, e.g. Cloudflare, NextDNS)"
              style={browserPolicyStyles.textInput}
            />

            <TextInput
              value={dohEndpoint}
              onChangeText={setDohEndpoint}
              placeholder="DNS-over-HTTPS URL"
              autoCapitalize="none"
              style={browserPolicyStyles.textInput}
            />

            <TextInput
              value={dotEndpoint}
              onChangeText={setDotEndpoint}
              placeholder="DNS-over-TLS endpoint"
              autoCapitalize="none"
              style={browserPolicyStyles.textInput}
            />

            <Pressable
              onPress={() => void savePolicy()}
              style={browserPolicyStyles.saveButton}
            >
              <Text style={browserPolicyStyles.saveButtonText}>
                {policy ? "Update DNS policy" : "Create DNS policy"}
              </Text>
            </Pressable>
          </View>

          {/* ================================================================ */}
          {/* 2. Domain Rules List & Creation */}
          {/* ================================================================ */}
          <Text
            style={[
              browserPolicyStyles.sectionTitle,
              { marginTop: 14, marginBottom: 9 },
            ]}
          >
            Domain rules
          </Text>

          {/* Add Rule Input Row */}
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 8 }}>
            <TextInput
              value={domain}
              onChangeText={setDomain}
              placeholder="example.com"
              autoCapitalize="none"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                padding: 10,
                color: C.text,
                backgroundColor: C.white,
              }}
            />
            <Pressable
              onPress={() => setAction(action === "BLOCK" ? "ALLOW" : "BLOCK")}
              style={{
                justifyContent: "center",
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: action === "BLOCK" ? C.red : C.green,
                backgroundColor: action === "BLOCK" ? "#FEE2E2" : "#DCFCE7",
                borderRadius: 9,
              }}
            >
              <Text
                style={{
                  color: action === "BLOCK" ? C.red : C.green,
                  fontWeight: "800",
                }}
              >
                {action}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => void addRule()}
              style={{
                justifyContent: "center",
                paddingHorizontal: 16,
                backgroundColor: C.navy,
                borderRadius: 9,
              }}
            >
              <Text style={{ color: C.white, fontWeight: "900" }}>Add</Text>
            </Pressable>
          </View>

          {/* Rules List */}
          {rules.map((rule) => (
            <View key={rule.id} style={browserPolicyStyles.ruleRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.navy, fontWeight: "700" }}>
                  {rule.domain}
                </Text>
                <Text
                  style={{
                    color: rule.action === "BLOCK" ? C.red : C.green,
                    fontSize: 10,
                    fontWeight: "800",
                    marginTop: 3,
                  }}
                >
                  {rule.action}
                </Text>
              </View>
              <Pressable onPress={() => void deleteRule(rule.id)}>
                <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. Domain Categories Catalog */}
      {/* ==================================================================== */}
      <Text
        style={[
          browserPolicyStyles.sectionTitle,
          { marginTop: 22, marginBottom: 9 },
        ]}
      >
        Domain categories
      </Text>

      <View style={{ flexDirection: "row", gap: 7 }}>
        <TextInput
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="New category name"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 9,
            padding: 10,
            color: C.text,
            backgroundColor: C.white,
          }}
        />
        <Pressable
          onPress={() => void addCategory()}
          style={{
            justifyContent: "center",
            paddingHorizontal: 16,
            backgroundColor: C.navy,
            borderRadius: 9,
          }}
        >
          <Text style={{ color: C.white, fontWeight: "900" }}>Create</Text>
        </Pressable>
      </View>

      {categories.map((category) => (
        <View
          key={category.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: C.border,
          }}
        >
          <Text style={{ color: C.text }}>
            {category.name} · {category.slug}
          </Text>
          <Pressable onPress={() => void deleteCategory(category.id)}>
            <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
          </Pressable>
        </View>
      ))}

      <Text
        style={{
          color: C.muted,
          fontSize: 11,
          lineHeight: 17,
          marginTop: 14,
        }}
      >
        Saving a database policy does not by itself configure a managed DNS
        profile or enforce policy on the operating system.
      </Text>
    </Screen>
  );
}

export default BrowserPolicyScreen;
