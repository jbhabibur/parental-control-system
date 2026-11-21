/**
 * ============================================================================
 * Sub-Feature: Browser Toolbar - UI Component
 * ============================================================================
 * Bottom navigation bar with Back, Forward, Refresh, and Safe Home actions.
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { browserToolbarStyles } from "./browser-toolbar.styles";

interface BrowserToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export function BrowserToolbar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  onHome,
}: BrowserToolbarProps) {
  return (
    <View style={browserToolbarStyles.bar}>
      <TouchableOpacity
        disabled={!canGoBack}
        onPress={onBack}
        style={[
          browserToolbarStyles.btn,
          !canGoBack && browserToolbarStyles.btnDisabled,
        ]}
      >
        <Text style={browserToolbarStyles.icon}>◀</Text>
        <Text style={browserToolbarStyles.label}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!canGoForward}
        onPress={onForward}
        style={[
          browserToolbarStyles.btn,
          !canGoForward && browserToolbarStyles.btnDisabled,
        ]}
      >
        <Text style={browserToolbarStyles.icon}>▶</Text>
        <Text style={browserToolbarStyles.label}>Forward</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRefresh} style={browserToolbarStyles.btn}>
        <Text style={browserToolbarStyles.icon}>↻</Text>
        <Text style={browserToolbarStyles.label}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onHome} style={browserToolbarStyles.btn}>
        <Text style={browserToolbarStyles.icon}>🏠</Text>
        <Text style={browserToolbarStyles.label}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
