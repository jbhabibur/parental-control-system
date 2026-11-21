/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - Main Controller Hook
 * ============================================================================
 * Manages all state, real-time Socket.IO sync, website approval/denial,
 * live block/unblock domain rules, DNS-level DoH/DoT config, and history.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../../services/api";
import { safeBrowserDashboardApi } from "../api/safe-browser-dashboard.api";
import { connectParentBrowserSocket } from "../api/safe-browser-dashboard.socket";
import type {
  BrowserStats,
  BrowsingHistoryItem,
  DeviceOption,
  DnsPolicyConfig,
  DomainAccessRequest,
  DomainRuleItem,
  LiveBannerNotice,
} from "../types";

const EMPTY_STATS: BrowserStats = {
  totalVisits: 0,
  blockedAttempts: 0,
  allowedDomains: 0,
  blockedDomains: 0,
  pendingCount: 0,
};

const STARTER_SAFE_DOMAINS = [
  "wikipedia.org",
  "khanacademy.org",
  "google.com",
  "kids.nationalgeographic.com",
];

export function useSafeBrowserDashboard() {
  // Devices & active selection
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // Synced browser data
  const [dnsPolicy, setDnsPolicy] = useState<DnsPolicyConfig | null>(null);
  const [domainRules, setDomainRules] = useState<DomainRuleItem[]>([]);
  const [history, setHistory] = useState<BrowsingHistoryItem[]>([]);
  const [domainRequests, setDomainRequests] = useState<DomainAccessRequest[]>(
    [],
  );
  const [stats, setStats] = useState<BrowserStats>(EMPTY_STATS);

  // Quick domain input & rule/history filter state
  const [domainInput, setDomainInput] = useState("");
  const [ruleFilter, setRuleFilter] = useState<"ALL" | "ALLOW" | "BLOCK">(
    "ALL",
  );
  const [historyFilter, setHistoryFilter] = useState<
    "ALL" | "BLOCKED" | "ALLOWED"
  >("ALL");

  // DNS settings form state
  const [dnsEnabled, setDnsEnabled] = useState(true);
  const [safeSearch, setSafeSearch] = useState(true);
  const [dnsProvider, setDnsProvider] = useState("Cloudflare Family");
  const [dohEndpoint, setDohEndpoint] = useState(
    "https://family.cloudflare-dns.com/dns-query",
  );
  const [dotEndpoint, setDotEndpoint] = useState("family.cloudflare-dns.com");
  const [savingDns, setSavingDns] = useState(false);

  // UI feedback & live socket state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [liveNotice, setLiveNotice] = useState<LiveBannerNotice | null>(null);

  const selectedDeviceIdRef = useRef(selectedDeviceId);
  useEffect(() => {
    selectedDeviceIdRef.current = selectedDeviceId;
  }, [selectedDeviceId]);

  /**
   * Loads full browser summary for a specific child device.
   */
  const loadSummary = useCallback(async (deviceId: string, silent = false) => {
    if (!deviceId) return;
    if (!silent) setError("");

    try {
      const summary = await safeBrowserDashboardApi.getBrowserSummary(deviceId);
      setDnsPolicy(summary.dnsPolicy);
      setDomainRules(summary.domainRules || []);
      setHistory(summary.history || []);
      setDomainRequests(summary.domainRequests || []);
      setStats(summary.stats || EMPTY_STATS);

      if (summary.dnsPolicy) {
        setDnsEnabled(summary.dnsPolicy.enabled);
        setSafeSearch(summary.dnsPolicy.safeSearch);
        setDnsProvider(summary.dnsPolicy.provider || "Cloudflare Family");
        setDohEndpoint(
          summary.dnsPolicy.dohEndpoint ||
            "https://family.cloudflare-dns.com/dns-query",
        );
        setDotEndpoint(
          summary.dnsPolicy.dotEndpoint || "family.cloudflare-dns.com",
        );
      }
    } catch (err) {
      if (!silent) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not load Safe Browser data.",
        );
      }
    }
  }, []);

  /**
   * Initial load: fetch enrolled child devices, then load first device summary.
   */
  const loadInitial = useCallback(async () => {
    setError("");
    try {
      const list = await safeBrowserDashboardApi.getDevices();
      setDevices(list);
      if (list.length > 0) {
        const targetId = selectedDeviceIdRef.current || list[0].id;
        setSelectedDeviceId(targetId);
        await loadSummary(targetId);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to load connected child devices.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadSummary]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  // Reload summary whenever parent switches child device
  useEffect(() => {
    if (selectedDeviceId) {
      void loadSummary(selectedDeviceId);
    }
  }, [selectedDeviceId, loadSummary]);

  /**
   * Real-time Socket.IO connection for instant parent alerts & approval cards.
   */
  useEffect(() => {
    let disconnect: (() => void) | undefined;
    let active = true;

    void connectParentBrowserSocket({
      onConnectionChange: (connected) => {
        if (active) setSocketConnected(connected);
      },
      onPermissionRequested: (payload) => {
        if (!active) return;
        setLiveNotice({
          type: "request",
          title: `Approval Requested: ${payload.resource || "Website"}`,
          body: `${payload.child?.name || "Your child"} wants to visit ${payload.resource || "a site"}`,
          timestamp: new Date().toLocaleTimeString(),
        });
        if (selectedDeviceIdRef.current) {
          void loadSummary(selectedDeviceIdRef.current, true);
        }
      },
      onDomainBlocked: (payload) => {
        if (!active) return;
        setLiveNotice({
          type: "blocked",
          title: `Blocked Attempt: ${payload.domain || "Website"}`,
          body: `${payload.childName || "Child"} tried opening ${payload.domain} (${payload.category || "Restricted"})`,
          timestamp: new Date().toLocaleTimeString(),
        });
        if (selectedDeviceIdRef.current) {
          void loadSummary(selectedDeviceIdRef.current, true);
        }
      },
      onBrowserActivity: () => {
        if (!active || !selectedDeviceIdRef.current) return;
        void loadSummary(selectedDeviceIdRef.current, true);
      },
    }).then((cleanup) => {
      if (active) {
        disconnect = cleanup;
      } else {
        cleanup();
      }
    });

    return () => {
      active = false;
      disconnect?.();
    };
  }, [loadSummary]);

  /**
   * Gentle 10-second polling fallback so dashboard stays fresh even without WebSocket.
   */
  useEffect(() => {
    if (!selectedDeviceId) return;
    const interval = setInterval(() => {
      void loadSummary(selectedDeviceId, true);
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedDeviceId, loadSummary]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void loadInitial();
  }, [loadInitial]);

  /**
   * Approves a pending website access request -> auto-adds ALLOW rule + unlocks Child Browser live.
   */
  const handleApproveRequest = async (req: DomainAccessRequest) => {
    setBusyId(req.id);
    try {
      await safeBrowserDashboardApi.approveDomainRequest(req.id);
      setLiveNotice(null);
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Approval Failed",
        err instanceof ApiError ? err.message : "Could not approve website.",
      );
    } finally {
      setBusyId("");
    }
  };

  /**
   * Denies a pending website access request -> auto-adds BLOCK rule + blocks Child Browser live.
   */
  const handleDenyRequest = async (req: DomainAccessRequest) => {
    setBusyId(req.id);
    try {
      await safeBrowserDashboardApi.denyDomainRequest(req.id);
      setLiveNotice(null);
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Deny Failed",
        err instanceof ApiError ? err.message : "Could not deny website.",
      );
    } finally {
      setBusyId("");
    }
  };

  /**
   * Quick Block or Allow any typed domain (or domain from history).
   */
  const handleQuickRule = async (
    action: "ALLOW" | "BLOCK",
    overrideDomain?: string,
  ) => {
    const raw = (overrideDomain ?? domainInput).trim().toLowerCase();
    if (!raw || !selectedDeviceId) {
      Alert.alert("Enter a website", "Type a domain like youtube.com or facebook.com.");
      return;
    }

    setBusyId(`quick:${raw}`);
    try {
      await safeBrowserDashboardApi.setDomainRule(selectedDeviceId, raw, action);
      if (!overrideDomain) setDomainInput("");
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Rule Update Failed",
        err instanceof ApiError ? err.message : "Could not save domain rule.",
      );
    } finally {
      setBusyId("");
    }
  };

  /**
   * Flips an existing rule instantly between ALLOW and BLOCK.
   */
  const handleToggleRule = async (rule: DomainRuleItem) => {
    if (!selectedDeviceId) return;
    const nextAction = rule.action === "ALLOW" ? "BLOCK" : "ALLOW";
    setBusyId(rule.id);
    try {
      await safeBrowserDashboardApi.updateDomainRule(
        selectedDeviceId,
        rule.id,
        nextAction,
      );
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Toggle Failed",
        err instanceof ApiError ? err.message : "Could not update domain rule.",
      );
    } finally {
      setBusyId("");
    }
  };

  /**
   * Deletes a domain rule completely (returns domain to default-approval mode).
   */
  const handleDeleteRule = async (ruleId: string) => {
    if (!selectedDeviceId) return;
    setBusyId(ruleId);
    try {
      await safeBrowserDashboardApi.deleteDomainRule(selectedDeviceId, ruleId);
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Delete Failed",
        err instanceof ApiError ? err.message : "Could not remove rule.",
      );
    } finally {
      setBusyId("");
    }
  };

  /**
   * Saves DNS-level protection policy (DoH / DoT / SafeSearch / Master toggle).
   */
  const handleSaveDnsPolicy = async () => {
    if (!selectedDeviceId) return;
    setSavingDns(true);
    try {
      await safeBrowserDashboardApi.saveDnsPolicy(
        selectedDeviceId,
        {
          enabled: dnsEnabled,
          safeSearch,
          provider: dnsProvider.trim() || null,
          dohEndpoint: dohEndpoint.trim() || null,
          dotEndpoint: dotEndpoint.trim() || null,
        },
        Boolean(dnsPolicy),
      );
      await loadSummary(selectedDeviceId, true);
      Alert.alert(
        "DNS Policy Synced",
        "Encrypted DNS & SafeSearch rules synced to child Safe Browser.",
      );
    } catch (err) {
      Alert.alert(
        "Save Failed",
        err instanceof ApiError ? err.message : "Could not save DNS policy.",
      );
    } finally {
      setSavingDns(false);
    }
  };

  /**
   * One-tap helper to allow common safe study websites for quick testing.
   */
  const handleAllowStarterSites = async () => {
    if (!selectedDeviceId) return;
    setBusyId("starter");
    try {
      await Promise.all(
        STARTER_SAFE_DOMAINS.map((dom) =>
          safeBrowserDashboardApi.setDomainRule(selectedDeviceId, dom, "ALLOW"),
        ),
      );
      await loadSummary(selectedDeviceId, true);
    } catch (err) {
      Alert.alert(
        "Failed",
        err instanceof ApiError ? err.message : "Could not add starter sites.",
      );
    } finally {
      setBusyId("");
    }
  };

  const pendingRequests = domainRequests.filter((r) => r.status === "PENDING");

  const filteredRules = domainRules.filter((rule) =>
    ruleFilter === "ALL" ? true : rule.action === ruleFilter,
  );

  const filteredHistory = history.filter((item) => {
    if (historyFilter === "BLOCKED") return item.blocked;
    if (historyFilter === "ALLOWED") return !item.blocked;
    return true;
  });

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    dnsPolicy,
    domainRules: filteredRules,
    totalRulesCount: domainRules.length,
    history: filteredHistory,
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
    refreshing,
    busyId,
    error,
    socketConnected,
    liveNotice,
    dismissLiveNotice: () => setLiveNotice(null),
    onRefresh,
    handleApproveRequest,
    handleDenyRequest,
    handleQuickRule,
    handleToggleRule,
    handleDeleteRule,
    handleSaveDnsPolicy,
    handleAllowStarterSites,
  };
}
