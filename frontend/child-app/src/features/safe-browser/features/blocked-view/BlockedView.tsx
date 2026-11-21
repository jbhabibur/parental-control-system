/**
 * ============================================================================
 * Sub-Feature: Blocked View - UI Component
 * ============================================================================
 * Displayed whenever a website is blocked by Parent DNS Rules, prohibited
 * keyword/category detection, or DNS-over-HTTPS (DoH) protection.
 * Lets the child optionally send a reason and ask the parent for permission.
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";
import { blockedViewStyles } from "./blocked-view.styles";

interface BlockedViewProps {
  domain: string;
  message: string;
  category?: string | null;
  submitting: boolean;
  onRequestAccess: (reason?: string) => void;
  onGoHome: () => void;
}

export function BlockedView({
  domain,
  message,
  category,
  submitting,
  onRequestAccess,
  onGoHome,
}: BlockedViewProps) {
  const [reason, setReason] = useState("");

  return (
    <ScrollView
      contentContainerStyle={blockedViewStyles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={blockedViewStyles.card}>
        <View style={blockedViewStyles.iconCircle}>
          <Text style={blockedViewStyles.icon}>🚫</Text>
        </View>

        <Text style={blockedViewStyles.title}>Website Blocked</Text>

        <View style={blockedViewStyles.domainPill}>
          <Text style={blockedViewStyles.domainText}>{domain}</Text>
        </View>

        {!!category && (
          <Text style={blockedViewStyles.categoryBadge}>
            Protection Category: {category}
          </Text>
        )}

        <Text style={blockedViewStyles.message}>{message}</Text>

        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Optional note to parent (e.g. For school homework)"
          placeholderTextColor={BROWSER_COLORS.muted}
          style={blockedViewStyles.reasonInput}
        />

        <TouchableOpacity
          disabled={submitting}
          onPress={() => onRequestAccess(reason.trim() || undefined)}
          style={blockedViewStyles.requestBtn}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={BROWSER_COLORS.white} />
          ) : (
            <Text style={blockedViewStyles.requestBtnText}>
              📩 Ask Parent for Permission
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoHome} style={blockedViewStyles.homeBtn}>
          <Text style={blockedViewStyles.homeBtnText}>← Back to Safe Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
