/**
 * ============================================================================
 * Sub-Feature: DNS Protection Section - UI Component
 * ============================================================================
 * Configures encrypted DNS-level protection (DoH / DoT) comparable to Circle /
 * NextDNS / Cloudflare Family, plus strict SafeSearch enforcement.
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
import { C } from "../../../../components/ui";
import { dnsProtectionStyles } from "./dns-protection.styles";

interface DnsProtectionSectionProps {
  enabled: boolean;
  onChangeEnabled: (val: boolean) => void;
  safeSearch: boolean;
  onChangeSafeSearch: (val: boolean) => void;
  provider: string;
  onChangeProvider: (val: string) => void;
  dohEndpoint: string;
  onChangeDohEndpoint: (val: string) => void;
  dotEndpoint: string;
  onChangeDotEndpoint: (val: string) => void;
  saving: boolean;
  onSave: () => void;
}

const DNS_PRESETS = [
  {
    label: "Cloudflare Family",
    provider: "Cloudflare Family (1.1.1.3)",
    doh: "https://family.cloudflare-dns.com/dns-query",
    dot: "family.cloudflare-dns.com",
  },
  {
    label: "AdGuard Family",
    provider: "AdGuard Family DNS",
    doh: "https://dns-family.adguard.com/dns-query",
    dot: "dns-family.adguard.com",
  },
  {
    label: "CleanBrowsing",
    provider: "CleanBrowsing Family",
    doh: "https://doh.cleanbrowsing.org/doh/family-filter/",
    dot: "family-filter-dns.cleanbrowsing.org",
  },
];

export function DnsProtectionSection({
  enabled,
  onChangeEnabled,
  safeSearch,
  onChangeSafeSearch,
  provider,
  onChangeProvider,
  dohEndpoint,
  onChangeDohEndpoint,
  dotEndpoint,
  onChangeDotEndpoint,
  saving,
  onSave,
}: DnsProtectionSectionProps) {
  return (
    <View style={dnsProtectionStyles.card}>
      <Text style={dnsProtectionStyles.title}>
        🛡️ DNS-Level Protection (DoH / DoT)
      </Text>
      <Text style={dnsProtectionStyles.subtitle}>
        Encrypted DNS filtering & strict SafeSearch enforced on the Child Safe
        Browser.
      </Text>

      <View style={dnsProtectionStyles.switchRow}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={dnsProtectionStyles.switchLabel}>
            Strict DNS & Approval Protection
          </Text>
          <Text style={dnsProtectionStyles.switchHint}>
            When enabled, unapproved websites require parent approval
          </Text>
        </View>
        <Switch value={enabled} onValueChange={onChangeEnabled} />
      </View>

      <View style={dnsProtectionStyles.switchRow}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={dnsProtectionStyles.switchLabel}>
            Enforce SafeSearch
          </Text>
          <Text style={dnsProtectionStyles.switchHint}>
            Forces strict SafeSearch on Google, Bing & DuckDuckGo
          </Text>
        </View>
        <Switch value={safeSearch} onValueChange={onChangeSafeSearch} />
      </View>

      {/* One-tap DNS Provider Presets */}
      <View style={dnsProtectionStyles.presetRow}>
        {DNS_PRESETS.map((preset) => (
          <Pressable
            key={preset.label}
            onPress={() => {
              onChangeProvider(preset.provider);
              onChangeDohEndpoint(preset.doh);
              onChangeDotEndpoint(preset.dot);
            }}
            style={dnsProtectionStyles.presetChip}
          >
            <Text style={dnsProtectionStyles.presetChipText}>
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={provider}
        onChangeText={onChangeProvider}
        placeholder="DNS Provider Name (e.g. Cloudflare Family, NextDNS)"
        placeholderTextColor={C.muted}
        style={dnsProtectionStyles.input}
      />

      <TextInput
        value={dohEndpoint}
        onChangeText={onChangeDohEndpoint}
        placeholder="DNS-over-HTTPS (DoH) URL"
        placeholderTextColor={C.muted}
        autoCapitalize="none"
        style={dnsProtectionStyles.input}
      />

      <TextInput
        value={dotEndpoint}
        onChangeText={onChangeDotEndpoint}
        placeholder="DNS-over-TLS (DoT) Hostname"
        placeholderTextColor={C.muted}
        autoCapitalize="none"
        style={dnsProtectionStyles.input}
      />

      <Pressable
        disabled={saving}
        onPress={onSave}
        style={dnsProtectionStyles.saveBtn}
      >
        {saving ? (
          <ActivityIndicator size="small" color={C.white} />
        ) : (
          <Text style={dnsProtectionStyles.saveBtnText}>
            Save & Sync DNS Policy
          </Text>
        )}
      </Pressable>
    </View>
  );
}
