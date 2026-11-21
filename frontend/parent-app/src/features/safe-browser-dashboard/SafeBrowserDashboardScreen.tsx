/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - Main Screen Component
 * ============================================================================
 * Clean top-level screen assembling all modular Parent Safe Browser sections:
 *  1. Real-time Socket.IO connection indicator & live alert banner
 *  2. Child device selector pills
 *  3. KPI stats overview (Total Visits, Blocked, Allowed Rules, Pending Approvals)
 *  4. ApprovalRequestsSection (Approve / Block child website requests live)
 *  5. DomainRulesSection (Instant Block / Allow any domain anytime)
 *  6. DnsProtectionSection (Encrypted DoH / DoT & SafeSearch config)
 *  7. BrowsingHistorySection (Full allowed + blocked browsing log)
 */

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen, Stat } from "../../components/ui";

import { useSafeBrowserDashboard } from "./hook/useSafeBrowserDashboard";
import { safeBrowserDashboardStyles } from "./style/safe-browser-dashboard.styles";

import { ApprovalRequestsSection } from "./features/approval-requests/ApprovalRequestsSection";
import { DomainRulesSection } from "./features/domain-rules/DomainRulesSection";
import { DnsProtectionSection } from "./features/dns-protection/DnsProtectionSection";
import { BrowsingHistorySection } from "./features/browsing-history/BrowsingHistorySection";

export function SafeBrowserDashboardScreen() {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    domainRules,
    totalRulesCount,
    history,
    pendingRequests,
    stats,
    domainInput,
    setDomainInput,
    ruleFilter,
    setRuleFilter,
    historyFilter,
    setHistoryFilter,
    dnsEnabled,
    setDnsEnabled,
    safeSearch,
    setSafeSearch,
    dnsProvider,
    setDnsProvider,
    dohEndpoint,
    setDohEndpoint,
    dotEndpoint,
    setDotEndpoint,
    savingDns,
    loading,
    busyId,
    error,
    socketConnected,
    liveNotice,
    dismissLiveNotice,
    onRefresh,
    handleApproveRequest,
    handleDenyRequest,
    handleQuickRule,
    handleToggleRule,
    handleDeleteRule,
    handleSaveDnsPolicy,
    handleAllowStarterSites,
  } = useSafeBrowserDashboard();

  return (
    <Screen>
      <PageHeader
        title="Safe Browser Control"
        subtitle="Approve child website requests, block/unblock sites live & configure DNS protection."
      />

      {/* 1. Live Sync Status Strip */}
      <View style={safeBrowserDashboardStyles.liveRow}>
        <View style={safeBrowserDashboardStyles.liveLeft}>
          <View
            style={[
              safeBrowserDashboardStyles.liveDot,
              { backgroundColor: socketConnected ? C.green : C.orange },
            ]}
          />
          <Text style={safeBrowserDashboardStyles.liveText}>
            {socketConnected
              ? "Live Real-Time Sync Connected"
              : "Auto-Sync Polling Active (10s)"}
          </Text>
        </View>
        <Pressable onPress={onRefresh}>
          <Text style={safeBrowserDashboardStyles.refreshLink}>↻ Refresh</Text>
        </Pressable>
      </View>

      {/* Real-Time Notification Banner */}
      {liveNotice && (
        <View
          style={[
            safeBrowserDashboardStyles.liveAlertBanner,
            {
              backgroundColor:
                liveNotice.type === "blocked" ? "#FEF2F2" : "#FFFBEB",
              borderColor:
                liveNotice.type === "blocked" ? "#FECACA" : "#FDE68A",
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={safeBrowserDashboardStyles.liveAlertTitle}>
              {liveNotice.type === "blocked" ? "🚨 " : "🔔 "}
              {liveNotice.title}
            </Text>
            <Text style={safeBrowserDashboardStyles.liveAlertBody}>
              {liveNotice.body} • {liveNotice.timestamp}
            </Text>
          </View>
          <Pressable onPress={dismissLiveNotice}>
            <Text style={safeBrowserDashboardStyles.dismissText}>Dismiss</Text>
          </Pressable>
        </View>
      )}

      {loading && (
        <ActivityIndicator color={C.blue} style={{ marginVertical: 16 }} />
      )}

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={safeBrowserDashboardStyles.errorText}
        >
          ⚠️ {error}
        </Text>
      )}

      {!loading && devices.length === 0 && (
        <View style={safeBrowserDashboardStyles.emptyBox}>
          <Text style={safeBrowserDashboardStyles.emptyTitle}>
            No Child Devices Paired Yet
          </Text>
          <Text style={safeBrowserDashboardStyles.emptySubtitle}>
            Pair a child device from the Connected Devices screen first, then
            open Safe Browser inside the Child App to test live controls.
          </Text>
        </View>
      )}

      {/* 2. Child Device Selector */}
      {devices.length > 0 && (
        <View style={safeBrowserDashboardStyles.devicePillsRow}>
          {devices.map((device) => {
            const active = device.id === selectedDeviceId;
            return (
              <Pressable
                key={device.id}
                onPress={() => setSelectedDeviceId(device.id)}
                style={[
                  safeBrowserDashboardStyles.devicePill,
                  active && safeBrowserDashboardStyles.devicePillActive,
                ]}
              >
                <Text
                  style={[
                    safeBrowserDashboardStyles.devicePillText,
                    active && safeBrowserDashboardStyles.devicePillTextActive,
                  ]}
                >
                  📱 {device.deviceName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {!!selectedDeviceId && (
        <>
          {/* 3. KPI Summary Cards */}
          <View style={safeBrowserDashboardStyles.statsRow}>
            <Stat
              label="PENDING APPROVALS"
              value={String(stats.pendingCount)}
              detail={
                stats.pendingCount > 0 ? "Needs decision" : "All reviewed"
              }
            />
            <Stat
              label="BLOCKED ATTEMPTS"
              value={String(stats.blockedAttempts)}
              detail={`of ${stats.totalVisits} total visits`}
            />
          </View>

          <View style={safeBrowserDashboardStyles.statsRow}>
            <Stat
              label="ALLOWED SITES"
              value={String(stats.allowedDomains)}
              detail="Approved domains"
            />
            <Stat
              label="BLOCKED RULES"
              value={String(stats.blockedDomains)}
              detail="Enforced at DNS"
            />
          </View>

          {/* 4. Pending Website Approval Requests */}
          <ApprovalRequestsSection
            requests={pendingRequests}
            busyId={busyId}
            onApprove={(req) => void handleApproveRequest(req)}
            onDeny={(req) => void handleDenyRequest(req)}
          />

          {/* 5. Instant Block / Allow Domain Rules */}
          <DomainRulesSection
            domainInput={domainInput}
            onChangeDomainInput={setDomainInput}
            rules={domainRules}
            totalCount={totalRulesCount}
            ruleFilter={ruleFilter}
            onChangeFilter={setRuleFilter}
            busyId={busyId}
            onQuickBlock={() => void handleQuickRule("BLOCK")}
            onQuickAllow={() => void handleQuickRule("ALLOW")}
            onToggleRule={(rule) => void handleToggleRule(rule)}
            onDeleteRule={(ruleId) => void handleDeleteRule(ruleId)}
            onAllowStarterSites={() => void handleAllowStarterSites()}
          />

          {/* 6. DNS-Level Protection & SafeSearch */}
          <DnsProtectionSection
            enabled={dnsEnabled}
            onChangeEnabled={setDnsEnabled}
            safeSearch={safeSearch}
            onChangeSafeSearch={setSafeSearch}
            provider={dnsProvider}
            onChangeProvider={setDnsProvider}
            dohEndpoint={dohEndpoint}
            onChangeDohEndpoint={setDohEndpoint}
            dotEndpoint={dotEndpoint}
            onChangeDotEndpoint={setDotEndpoint}
            saving={savingDns}
            onSave={() => void handleSaveDnsPolicy()}
          />

          {/* 7. Browsing History & Blocked Attempts Log */}
          <BrowsingHistorySection
            history={history}
            historyFilter={historyFilter}
            onChangeFilter={setHistoryFilter}
            onQuickAction={(domain, action) =>
              void handleQuickRule(action, domain)
            }
          />
        </>
      )}
    </Screen>
  );
}

export default SafeBrowserDashboardScreen;
