/**
 * ============================================================================
 * Sub-Feature: Domain Rules Section - UI Component
 * ============================================================================
 * Allows parent to instantly BLOCK or ALLOW any website anytime, toggle an
 * existing rule between BLOCK and ALLOW in one tap, or remove rules.
 */

import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { C } from "../../../../components/ui";
import type { DomainRuleItem } from "../../types";
import { domainRulesStyles } from "./domain-rules.styles";

interface DomainRulesSectionProps {
  domainInput: string;
  onChangeDomainInput: (val: string) => void;
  rules: DomainRuleItem[];
  totalCount: number;
  ruleFilter: "ALL" | "ALLOW" | "BLOCK";
  onChangeFilter: (filter: "ALL" | "ALLOW" | "BLOCK") => void;
  busyId: string;
  onQuickBlock: () => void;
  onQuickAllow: () => void;
  onToggleRule: (rule: DomainRuleItem) => void;
  onDeleteRule: (ruleId: string) => void;
  onAllowStarterSites: () => void;
}

export function DomainRulesSection({
  domainInput,
  onChangeDomainInput,
  rules,
  totalCount,
  ruleFilter,
  onChangeFilter,
  busyId,
  onQuickBlock,
  onQuickAllow,
  onToggleRule,
  onDeleteRule,
  onAllowStarterSites,
}: DomainRulesSectionProps) {
  return (
    <View style={domainRulesStyles.card}>
      <Text style={domainRulesStyles.title}>
        🌐 Instant Block / Unblock Websites ({totalCount})
      </Text>
      <Text style={domainRulesStyles.subtitle}>
        Changes sync live to your child&apos;s Safe Browser and DNS policy.
      </Text>

      <TextInput
        value={domainInput}
        onChangeText={onChangeDomainInput}
        placeholder="Enter website (e.g. youtube.com, facebook.com)"
        placeholderTextColor={C.muted}
        autoCapitalize="none"
        autoCorrect={false}
        style={domainRulesStyles.input}
      />

      <View style={domainRulesStyles.quickBtnsRow}>
        <Pressable
          disabled={!!busyId}
          onPress={onQuickBlock}
          style={domainRulesStyles.blockBtn}
        >
          <Text style={domainRulesStyles.quickBtnText}>🚫 Block Domain</Text>
        </Pressable>

        <Pressable
          disabled={!!busyId}
          onPress={onQuickAllow}
          style={domainRulesStyles.allowBtn}
        >
          <Text style={domainRulesStyles.quickBtnText}>✅ Allow Domain</Text>
        </Pressable>
      </View>

      <Pressable
        disabled={busyId === "starter"}
        onPress={onAllowStarterSites}
        style={domainRulesStyles.starterBtn}
      >
        <Text style={domainRulesStyles.starterBtnText}>
          🎓 Quick Allow Safe Study Sites (Wikipedia, Khan Academy, Google)
        </Text>
      </Pressable>

      {/* Rule Filter Pills */}
      <View style={domainRulesStyles.filterRow}>
        {(["ALL", "ALLOW", "BLOCK"] as const).map((tab) => {
          const active = ruleFilter === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onChangeFilter(tab)}
              style={[
                domainRulesStyles.filterChip,
                active && domainRulesStyles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  domainRulesStyles.filterChipText,
                  active && domainRulesStyles.filterChipTextActive,
                ]}
              >
                {tab === "ALL"
                  ? "All Rules"
                  : tab === "ALLOW"
                    ? "Allowed"
                    : "Blocked"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Active Rules List */}
      {rules.length === 0 ? (
        <Text style={domainRulesStyles.emptyText}>
          No matching domain rules yet.
        </Text>
      ) : (
        rules.map((rule) => {
          const isAllowed = rule.action === "ALLOW";
          return (
            <View key={rule.id} style={domainRulesStyles.ruleRow}>
              <View style={{ flex: 1 }}>
                <Text style={domainRulesStyles.ruleDomain}>{rule.domain}</Text>
                <View
                  style={[
                    domainRulesStyles.badge,
                    { backgroundColor: isAllowed ? "#DCFCE7" : "#FEE2E2" },
                  ]}
                >
                  <Text
                    style={[
                      domainRulesStyles.badgeText,
                      { color: isAllowed ? C.green : C.red },
                    ]}
                  >
                    {isAllowed ? "ALLOWED" : "BLOCKED"}
                  </Text>
                </View>
              </View>

              <View style={domainRulesStyles.ruleActions}>
                <Pressable
                  disabled={busyId === rule.id}
                  onPress={() => onToggleRule(rule)}
                  style={[
                    domainRulesStyles.toggleBtn,
                    {
                      borderColor: isAllowed ? "#FECACA" : "#BBF7D0",
                      backgroundColor: isAllowed ? "#FEF2F2" : "#F0FDF4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      domainRulesStyles.toggleBtnText,
                      { color: isAllowed ? C.red : C.green },
                    ]}
                  >
                    {isAllowed ? "Block" : "Unblock"}
                  </Text>
                </Pressable>

                <Pressable
                  disabled={busyId === rule.id}
                  onPress={() => onDeleteRule(rule.id)}
                  style={domainRulesStyles.deleteBtn}
                >
                  <Text style={domainRulesStyles.deleteBtnText}>✕</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
