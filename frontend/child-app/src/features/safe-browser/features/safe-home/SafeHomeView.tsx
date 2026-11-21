/**
 * ============================================================================
 * Sub-Feature: Safe Home View - UI Component
 * ============================================================================
 * Default landing screen inside the Child Safe Browser showing:
 *  - Active DNS & SafeSearch protection badges
 *  - Safe search bar
 *  - Parent-approved websites (one-tap open)
 *  - Popular educational quick links (verified through backend rules)
 *  - Recent website approval request statuses
 */

import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";
import type {
  DeviceDnsPolicy,
  DomainPermissionRequest,
  QuickLinkItem,
} from "../../types";
import { safeHomeStyles } from "./safe-home.styles";

const SUGGESTED_LINKS: QuickLinkItem[] = [
  {
    id: "wiki",
    title: "Wikipedia",
    domain: "wikipedia.org",
    url: "https://www.wikipedia.org",
    icon: "📚",
    description: "Free encyclopedia",
  },
  {
    id: "khan",
    title: "Khan Academy",
    domain: "khanacademy.org",
    url: "https://www.khanacademy.org",
    icon: "🎓",
    description: "Math & science lessons",
  },
  {
    id: "natgeo",
    title: "NatGeo Kids",
    domain: "kids.nationalgeographic.com",
    url: "https://kids.nationalgeographic.com",
    icon: "🌍",
    description: "Nature & animals",
  },
  {
    id: "google",
    title: "Google SafeSearch",
    domain: "google.com",
    url: "https://www.google.com/?safe=active",
    icon: "🔎",
    description: "Filtered search engine",
  },
];

interface SafeHomeViewProps {
  dnsPolicy: DeviceDnsPolicy | null;
  approvedDomains: string[];
  recentRequests: DomainPermissionRequest[];
  onNavigate: (url: string) => void;
}

export function SafeHomeView({
  dnsPolicy,
  approvedDomains,
  recentRequests,
  onNavigate,
}: SafeHomeViewProps) {
  const [query, setQuery] = useState("");

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    onNavigate(query.trim());
    setQuery("");
  };

  return (
    <ScrollView
      contentContainerStyle={safeHomeStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero & Protection Badges */}
      <View style={safeHomeStyles.hero}>
        <View style={safeHomeStyles.heroBadge}>
          <Text style={safeHomeStyles.heroIcon}>🛡️</Text>
        </View>
        <Text style={safeHomeStyles.heroTitle}>ChildSafe Browser</Text>
        <Text style={safeHomeStyles.heroSubtitle}>
          Protected by Parent DNS Rules. Visiting a new website automatically
          asks your parent for approval.
        </Text>

        <View style={safeHomeStyles.policyPills}>
          <View style={safeHomeStyles.policyPill}>
            <Text style={safeHomeStyles.policyPillText}>
              {dnsPolicy?.enabled === false
                ? "DNS Filter: Off"
                : `DNS: ${dnsPolicy?.provider || "Family DNS Active"}`}
            </Text>
          </View>
          <View style={safeHomeStyles.policyPill}>
            <Text style={safeHomeStyles.policyPillText}>
              {dnsPolicy?.safeSearch === false
                ? "SafeSearch: Off"
                : "SafeSearch: Strict"}
            </Text>
          </View>
        </View>
      </View>

      {/* Safe Search Box */}
      <View style={safeHomeStyles.searchCard}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Type a website or search topic..."
          placeholderTextColor={BROWSER_COLORS.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          style={safeHomeStyles.searchInput}
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          style={safeHomeStyles.searchBtn}
        >
          <Text style={safeHomeStyles.searchBtnText}>Visit</Text>
        </TouchableOpacity>
      </View>

      {/* Parent-Approved Sites */}
      {approvedDomains.length > 0 && (
        <>
          <Text style={safeHomeStyles.sectionTitle}>
            ✅ Approved by Parent ({approvedDomains.length})
          </Text>
          <View style={safeHomeStyles.approvedGrid}>
            {approvedDomains.map((domain) => (
              <TouchableOpacity
                key={domain}
                onPress={() => onNavigate(`https://${domain}`)}
                style={safeHomeStyles.approvedChip}
              >
                <Text style={safeHomeStyles.approvedChipText}>🌐 {domain}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Quick Educational Links */}
      <Text style={safeHomeStyles.sectionTitle}>Explore Websites</Text>
      <View style={safeHomeStyles.quickGrid}>
        {SUGGESTED_LINKS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onNavigate(item.url)}
            style={safeHomeStyles.quickCard}
          >
            <Text style={safeHomeStyles.quickIcon}>{item.icon}</Text>
            <Text style={safeHomeStyles.quickTitle}>{item.title}</Text>
            <Text style={safeHomeStyles.quickDesc}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Website Requests Status */}
      {recentRequests.length > 0 && (
        <>
          <Text style={safeHomeStyles.sectionTitle}>
            Recent Website Requests
          </Text>
          {recentRequests.slice(0, 6).map((req) => {
            const isApproved = req.status === "APPROVED";
            const isDenied = req.status === "DENIED";
            return (
              <TouchableOpacity
                key={req.id}
                onPress={() => onNavigate(`https://${req.resource}`)}
                style={safeHomeStyles.requestCard}
              >
                <Text style={safeHomeStyles.requestDomain}>{req.resource}</Text>
                <Text
                  style={[
                    safeHomeStyles.requestStatus,
                    {
                      backgroundColor: isApproved
                        ? BROWSER_COLORS.greenSoft
                        : isDenied
                          ? BROWSER_COLORS.redSoft
                          : BROWSER_COLORS.amberSoft,
                      color: isApproved
                        ? BROWSER_COLORS.green
                        : isDenied
                          ? BROWSER_COLORS.red
                          : BROWSER_COLORS.amber,
                    },
                  ]}
                >
                  {req.status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}
