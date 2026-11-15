/**
 * ============================================================================
 * Feature: Screen Time - UI Component
 * ============================================================================
 * Visual presentation for Screen Time configuration.
 * Displays:
 * 1. Device selector tabs
 * 2. Master policy toggle and daily limit configuration
 * 3. Bedtime window & timezone settings
 * 4. List of configured per-app time restrictions with deletion
 * 5. Add new app limit input form
 * 6. Quick remote pause command button
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
import { useScreenTime } from "./useScreenTime";
import { screenTimeStyles } from "./screen-time.styles";

export function ScreenTimeScreen() {
  const {
    devices,
    deviceId,
    setDeviceId,
    policy,
    limits,
    dailyLimit,
    setDailyLimit,
    bedtimeStart,
    setBedtimeStart,
    bedtimeEnd,
    setBedtimeEnd,
    timezone,
    setTimezone,
    enabled,
    setEnabled,
    appIdentifier,
    setAppIdentifier,
    appLimitMinutes,
    setAppLimitMinutes,
    loading,
    saving,
    error,
    savePolicy,
    addAppLimit,
    removeAppLimit,
    pauseDevice,
  } = useScreenTime();

  return (
    <Screen>
      <PageHeader
        title="Screen time"
        subtitle="Configure policy for a connected child device."
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
          Connect a child device before configuring screen time.
        </Text>
      )}

      {devices.length > 0 && (
        <>
          {/* ================================================================ */}
          {/* 1. Device Selector Tabs */}
          {/* ================================================================ */}
          <Text style={{ color: C.navy, fontWeight: "800", marginBottom: 8 }}>
            Device
          </Text>
          <View style={{ gap: 7, marginBottom: 16 }}>
            {devices.map((item) => {
              const isSelected = item.id === deviceId;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setDeviceId(item.id)}
                  style={[
                    screenTimeStyles.deviceCard,
                    {
                      borderColor: isSelected ? C.blue : C.border,
                      backgroundColor: isSelected ? C.pale : C.white,
                    },
                  ]}
                >
                  <Text style={{ color: C.navy, fontWeight: "700" }}>
                    {item.deviceName}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ================================================================ */}
          {/* 2. Master Policy Configuration Card */}
          {/* ================================================================ */}
          <View style={screenTimeStyles.card}>
            <View style={screenTimeStyles.policyHeaderRow}>
              <Text style={{ color: C.navy, fontWeight: "900" }}>
                Policy enabled
              </Text>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
                thumbColor={enabled ? "#28744D" : "#FFFFFF"}
                accessibilityLabel="Enable screen-time policy"
              />
            </View>

            <Text style={screenTimeStyles.inputLabel}>
              Daily limit (minutes)
            </Text>
            <TextInput
              value={dailyLimit}
              onChangeText={setDailyLimit}
              keyboardType="number-pad"
              style={screenTimeStyles.textInput}
            />

            <Text style={screenTimeStyles.inputLabel}>
              Bedtime start (HH:mm)
            </Text>
            <TextInput
              value={bedtimeStart}
              onChangeText={setBedtimeStart}
              placeholder="21:00"
              style={screenTimeStyles.textInput}
            />

            <Text style={screenTimeStyles.inputLabel}>
              Bedtime end (HH:mm)
            </Text>
            <TextInput
              value={bedtimeEnd}
              onChangeText={setBedtimeEnd}
              placeholder="07:00"
              style={screenTimeStyles.textInput}
            />

            <Text style={screenTimeStyles.inputLabel}>Timezone</Text>
            <TextInput
              value={timezone}
              onChangeText={setTimezone}
              autoCapitalize="none"
              style={screenTimeStyles.textInput}
            />

            <Pressable
              disabled={saving}
              onPress={() => void savePolicy()}
              style={screenTimeStyles.saveButton}
            >
              <Text style={screenTimeStyles.saveButtonText}>
                {saving
                  ? "Saving..."
                  : policy
                    ? "Update policy"
                    : "Create policy"}
              </Text>
            </Pressable>
          </View>

          {/* ================================================================ */}
          {/* 3. Per-App Limits Section */}
          {/* ================================================================ */}
          <Text style={screenTimeStyles.sectionTitle}>Per-app limits</Text>

          {!policy && (
            <Text style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
              Create a screen-time policy before adding app limits.
            </Text>
          )}

          {limits.map((item) => (
            <View key={item.id} style={screenTimeStyles.appLimitRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.navy, fontWeight: "700" }}>
                  {item.appIdentifier}
                </Text>
                <Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                  {item.limitMinutes} minutes
                </Text>
              </View>
              <Pressable onPress={() => void removeAppLimit(item.id)}>
                <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
              </Pressable>
            </View>
          ))}

          {/* Add App Limit Form */}
          {!!policy && (
            <View style={screenTimeStyles.addLimitCard}>
              <TextInput
                value={appIdentifier}
                onChangeText={setAppIdentifier}
                placeholder="Package / app identifier (e.g. com.google.android.youtube)"
                autoCapitalize="none"
                style={screenTimeStyles.addLimitInput}
              />
              <TextInput
                value={appLimitMinutes}
                onChangeText={setAppLimitMinutes}
                placeholder="Minutes per day"
                keyboardType="number-pad"
                style={screenTimeStyles.addLimitInput}
              />
              <Pressable
                onPress={() => void addAppLimit()}
                style={screenTimeStyles.addLimitButton}
              >
                <Text style={{ color: C.blue, fontWeight: "800" }}>
                  Add app limit
                </Text>
              </Pressable>
            </View>
          )}

          {/* Remote Pause Button */}
          <Pressable
            onPress={() => void pauseDevice()}
            style={screenTimeStyles.pauseButton}
          >
            <Text style={{ color: C.white, fontWeight: "800" }}>
              Queue pause command
            </Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

export default ScreenTimeScreen;
