/**
 * ============================================================================
 * Sub-Feature: Approval Requests Section - UI Component
 * ============================================================================
 * Shows real-time pending website access requests submitted by the child's
 * Safe Browser. Tapping Approve immediately creates an ALLOW rule and unlocks
 * the child's page; tapping Block denies it and adds a BLOCK rule.
 */

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C } from "../../../../components/ui";
import type { DomainAccessRequest } from "../../types";
import { approvalRequestsStyles } from "./approval-requests.styles";

interface ApprovalRequestsSectionProps {
  requests: DomainAccessRequest[];
  busyId: string;
  onApprove: (request: DomainAccessRequest) => void;
  onDeny: (request: DomainAccessRequest) => void;
}

export function ApprovalRequestsSection({
  requests,
  busyId,
  onApprove,
  onDeny,
}: ApprovalRequestsSectionProps) {
  return (
    <View style={approvalRequestsStyles.card}>
      <View style={approvalRequestsStyles.headerRow}>
        <Text style={approvalRequestsStyles.title}>
          🔔 Website Approval Requests
        </Text>
        <View style={approvalRequestsStyles.badge}>
          <Text style={approvalRequestsStyles.badgeText}>
            {requests.length} Pending
          </Text>
        </View>
      </View>

      {requests.length === 0 ? (
        <Text style={approvalRequestsStyles.emptyText}>
          No pending website requests right now. When your child tries to open a
          new website, it will appear here instantly.
        </Text>
      ) : (
        requests.map((req) => {
          const isBusy = busyId === req.id;
          return (
            <View key={req.id} style={approvalRequestsStyles.item}>
              <Text style={approvalRequestsStyles.domain}>🌐 {req.resource}</Text>
              <Text style={approvalRequestsStyles.meta}>
                {req.child?.name || "Child"} •{" "}
                {req.device?.deviceName || "Child Device"} •{" "}
                {new Date(req.createdAt).toLocaleTimeString()}
              </Text>
              {!!req.reason && (
                <Text style={approvalRequestsStyles.reason}>“{req.reason}”</Text>
              )}

              <View style={approvalRequestsStyles.actionsRow}>
                <Pressable
                  disabled={isBusy}
                  onPress={() => onApprove(req)}
                  style={approvalRequestsStyles.approveBtn}
                >
                  {isBusy ? (
                    <ActivityIndicator size="small" color={C.white} />
                  ) : (
                    <Text style={approvalRequestsStyles.btnText}>
                      ✓ Approve Site
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={isBusy}
                  onPress={() => onDeny(req)}
                  style={approvalRequestsStyles.denyBtn}
                >
                  <Text style={approvalRequestsStyles.btnText}>✕ Block Site</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
