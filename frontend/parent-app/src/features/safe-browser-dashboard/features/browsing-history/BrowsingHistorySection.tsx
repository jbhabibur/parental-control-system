/**
 * ============================================================================
 * Sub-Feature: Browsing History Section - UI Component
 * ============================================================================
 * Displays the child's Safe Browser history (both allowed and blocked attempts)
 * with filter pills and one-tap Block / Allow controls on any visited domain.
 */

import React from "react";
import { Pressable, Text, View } from "react-native";
import { C } from "../../../../components/ui";
import type { BrowsingHistoryItem } from "../../types";
import { browsingHistoryStyles } from "./browsing-history.styles";

interface BrowsingHistorySectionProps {
  history: BrowsingHistoryItem[];
  historyFilter: "ALL" | "BLOCKED" | "ALLOWED";
  onChangeFilter: (filter: "ALL" | "BLOCKED" | "ALLOWED") => void;
  onQuickAction: (domain: string, action: "ALLOW" | "BLOCK") => void;
}

export function BrowsingHistorySection({
  history,
  historyFilter,
  onChangeFilter,
  onQuickAction,
}: BrowsingHistorySectionProps) {
  return (
    <View style={browsingHistoryStyles.card}>
      <Text style={browsingHistoryStyles.title}>
        📜 Browsing Activity & Blocked Attempts ({history.length})
      </Text>

      <View style={browsingHistoryStyles.filterRow}>
        {(["ALL", "BLOCKED", "ALLOWED"] as const).map((tab) => {
          const active = historyFilter === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onChangeFilter(tab)}
              style={[
                browsingHistoryStyles.filterChip,
                active && browsingHistoryStyles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  browsingHistoryStyles.filterChipText,
                  active && browsingHistoryStyles.filterChipTextActive,
                ]}
              >
                {tab === "ALL"
                  ? "All"
                  : tab === "BLOCKED"
                    ? "Blocked"
                    : "Allowed"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {history.length === 0 ? (
        <Text style={browsingHistoryStyles.emptyText}>
          No browsing history recorded yet for this device.
        </Text>
      ) : (
        history.slice(0, 25).map((entry) => (
          <View key={entry.id} style={browsingHistoryStyles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={browsingHistoryStyles.domain} numberOfLines={1}>
                {entry.domain}
              </Text>
              <Text style={browsingHistoryStyles.url} numberOfLines={1}>
                {entry.url}
              </Text>
              <View style={browsingHistoryStyles.metaRow}>
                <View
                  style={[
                    browsingHistoryStyles.statusBadge,
                    {
                      backgroundColor: entry.blocked ? "#FEE2E2" : "#DCFCE7",
                    },
                  ]}
                >
                  <Text
                    style={[
                      browsingHistoryStyles.statusBadgeText,
                      { color: entry.blocked ? C.red : C.green },
                    ]}
                  >
                    {entry.blocked
                      ? entry.category || "BLOCKED"
                      : "ALLOWED"}
                  </Text>
                </View>
                <Text style={browsingHistoryStyles.timeText}>
                  {new Date(entry.visitedAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() =>
                onQuickAction(entry.domain, entry.blocked ? "ALLOW" : "BLOCK")
              }
              style={[
                browsingHistoryStyles.quickActionBtn,
                {
                  borderColor: entry.blocked ? "#BBF7D0" : "#FECACA",
                  backgroundColor: entry.blocked ? "#F0FDF4" : "#FEF2F2",
                },
              ]}
            >
              <Text
                style={[
                  browsingHistoryStyles.quickActionText,
                  { color: entry.blocked ? C.green : C.red },
                ]}
              >
                {entry.blocked ? "Allow" : "Block"}
              </Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}
