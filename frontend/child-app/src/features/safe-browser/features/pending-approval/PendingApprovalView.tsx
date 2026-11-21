/**
 * ============================================================================
 * Sub-Feature: Pending Approval View - UI Component
 * ============================================================================
 * Displayed when a child tries to visit a website that has not been approved
 * by the parent yet. Automatically unlocks as soon as parent taps "Approve"
 * (via Socket.IO push + 5-second auto-poll fallback).
 */

import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";
import { pendingApprovalStyles } from "./pending-approval.styles";

interface PendingApprovalViewProps {
  domain: string;
  message: string;
  socketConnected: boolean;
  onCheckNow: () => void;
  onGoHome: () => void;
}

export function PendingApprovalView({
  domain,
  message,
  socketConnected,
  onCheckNow,
  onGoHome,
}: PendingApprovalViewProps) {
  return (
    <ScrollView contentContainerStyle={pendingApprovalStyles.container}>
      <View style={pendingApprovalStyles.card}>
        <View style={pendingApprovalStyles.iconCircle}>
          <Text style={pendingApprovalStyles.icon}>⏳</Text>
        </View>

        <Text style={pendingApprovalStyles.title}>
          Waiting for Parent Approval
        </Text>

        <View style={pendingApprovalStyles.domainPill}>
          <Text style={pendingApprovalStyles.domainText}>{domain}</Text>
        </View>

        <Text style={pendingApprovalStyles.message}>
          {message ||
            "Your parent has been notified. This website will open automatically once approved."}
        </Text>

        <View style={pendingApprovalStyles.waitingBox}>
          <ActivityIndicator size="small" color={BROWSER_COLORS.amber} />
          <Text style={pendingApprovalStyles.waitingText}>
            {socketConnected
              ? "Live sync active • Listening for parent decision"
              : "Auto-checking parent decision every 5 seconds..."}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onCheckNow}
          style={pendingApprovalStyles.checkNowBtn}
        >
          <Text style={pendingApprovalStyles.checkNowBtnText}>
            🔄 Check Approval Status Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGoHome}
          style={pendingApprovalStyles.homeBtn}
        >
          <Text style={pendingApprovalStyles.homeBtnText}>
            ← Back to Safe Home
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
