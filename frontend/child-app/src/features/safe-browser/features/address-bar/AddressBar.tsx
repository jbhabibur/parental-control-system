/**
 * ============================================================================
 * Sub-Feature: Address Bar - UI Component
 * ============================================================================
 * Top URL / Search input bar with HTTPS lock indicator, loading spinner,
 * back-to-app button, and Go trigger.
 */

import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";
import { addressBarStyles } from "./address-bar.styles";

interface AddressBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onExitBrowser: () => void;
  isBusy: boolean;
  isSecure: boolean;
}

export function AddressBar({
  value,
  onChangeText,
  onSubmit,
  onExitBrowser,
  isBusy,
  isSecure,
}: AddressBarProps) {
  return (
    <View style={addressBarStyles.wrapper}>
      {/* Return to Child Monitoring Status screen */}
      <TouchableOpacity
        accessibilityLabel="Exit Safe Browser"
        onPress={onExitBrowser}
        style={addressBarStyles.backAppBtn}
      >
        <Text style={addressBarStyles.backAppText}>←</Text>
      </TouchableOpacity>

      {/* URL / Search input */}
      <View style={addressBarStyles.inputBox}>
        <Text style={addressBarStyles.lockIcon}>
          {isSecure ? "🔒" : "🛡️"}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Search safely or enter website (e.g. wikipedia.org)"
          placeholderTextColor={BROWSER_COLORS.muted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          selectTextOnFocus
          style={addressBarStyles.input}
        />
        {isBusy && (
          <ActivityIndicator size="small" color={BROWSER_COLORS.blue} />
        )}
      </View>

      {/* Go Button */}
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onSubmit}
        style={addressBarStyles.goBtn}
      >
        <Text style={addressBarStyles.goBtnText}>Go</Text>
      </TouchableOpacity>
    </View>
  );
}
