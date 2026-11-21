/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - Main Controller Hook
 * ============================================================================
 * Manages the full lifecycle of the Child Safe Browser:
 *  1. Syncs active DNS policy & parent rules from backend
 *  2. Checks every URL/domain with backend before allowing page load
 *  3. Handles Blocked, Pending Parent Approval, Loaded, and Safe Home states
 *  4. Listens to real-time Socket.IO events (`permission:resolved`, `dns:policy-updated`)
 *     so parent approvals/blocks apply instantly — even mid-browsing!
 *  5. Auto-polls every 5 seconds while waiting for parent approval (offline-safe fallback)
 *  6. Maintains browser history stack (Back / Forward / Refresh / Home)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { ApiError } from "../../../lib/api";
import { browserApi } from "../api/browser.api";
import { connectBrowserSocket } from "../api/browser.socket";
import type {
  BrowsingState,
  DeviceDnsPolicy,
  DomainPermissionRequest,
  HistoryEntry,
} from "../types";
import {
  enforceSafeSearchOnUrl,
  extractDomain,
  normalizeInputToUrl,
} from "./useUrlFilter";

export function useSafeBrowser() {
  // Address bar text vs currently evaluated/loaded URL
  const [addressInput, setAddressInput] = useState("");
  const [activeUrl, setActiveUrl] = useState("");
  const [activeDomain, setActiveDomain] = useState("");
  const [pageTitle, setPageTitle] = useState("ChildSafe Browser");

  // Browser UI state machine
  const [browsingState, setBrowsingState] = useState<BrowsingState>("home");
  const [statusMessage, setStatusMessage] = useState("");
  const [blockCategory, setBlockCategory] = useState<string | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  // Synced DNS policy & live socket connection status
  const [dnsPolicy, setDnsPolicy] = useState<DeviceDnsPolicy | null>(null);
  const [recentRequests, setRecentRequests] = useState<
    DomainPermissionRequest[]
  >([]);
  const [socketConnected, setSocketConnected] = useState(false);

  // Navigation history stack (Back / Forward)
  const [historyStack, setHistoryStack] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Reload key forces WebView/iframe to re-mount when user taps Refresh
  const [reloadKey, setReloadKey] = useState(0);

  // Refs to read latest state cleanly inside Socket.IO callbacks
  const activeUrlRef = useRef(activeUrl);
  const activeDomainRef = useRef(activeDomain);
  const browsingStateRef = useRef(browsingState);
  const dnsPolicyRef = useRef(dnsPolicy);

  useEffect(() => {
    activeUrlRef.current = activeUrl;
    activeDomainRef.current = activeDomain;
    browsingStateRef.current = browsingState;
    dnsPolicyRef.current = dnsPolicy;
  }, [activeUrl, activeDomain, browsingState, dnsPolicy]);

  /**
   * Loads the device's current DNS Policy, domain rules, and recent requests.
   */
  const syncPolicy = useCallback(async () => {
    try {
      const result = await browserApi.getDnsPolicy();
      setDnsPolicy(result.dnsPolicy);
      setRecentRequests(result.domainRequests || []);
    } catch {
      // Non-fatal: check-url endpoint enforces rules authoritatively on server
    }
  }, []);

  /**
   * Core navigation function:
   *  1. Normalizes input & enforces SafeSearch
   *  2. Calls backend `POST /api/device/browser/check-url`
   *  3. Transitions browser state to loading / blocked / pending_approval
   */
  const navigateTo = useCallback(
    async (
      rawInput: string,
      options?: { pushToHistory?: boolean; autoRequest?: boolean },
    ) => {
      const pushToHistory = options?.pushToHistory ?? true;
      const autoRequest = options?.autoRequest ?? true;

      const safeSearchOn = dnsPolicyRef.current?.safeSearch ?? true;
      const targetUrl = normalizeInputToUrl(rawInput, safeSearchOn);
      if (!targetUrl) return;

      const targetDomain = extractDomain(targetUrl);
      if (!targetDomain) {
        setStatusMessage("Please enter a valid website address or search term.");
        setBrowsingState("error");
        return;
      }

      setAddressInput(targetUrl);
      setActiveUrl(targetUrl);
      setActiveDomain(targetDomain);
      setStatusMessage("");
      setBlockCategory(null);
      setBrowsingState("checking");

      try {
        const result = await browserApi.checkUrl({
          url: targetUrl,
          domain: targetDomain,
          autoRequest,
        });

        const finalUrl = enforceSafeSearchOnUrl(targetUrl, result.safeSearch);
        setActiveUrl(finalUrl);
        setAddressInput(finalUrl);

        if (result.allowed) {
          setPendingRequestId(null);
          setBrowsingState("loading");

          if (pushToHistory) {
            setHistoryStack((prev) => {
              const sliced = prev.slice(0, historyIndex + 1);
              const last = sliced[sliced.length - 1];
              if (last && last.url === finalUrl) return sliced;
              return [
                ...sliced,
                {
                  url: finalUrl,
                  domain: targetDomain,
                  timestamp: Date.now(),
                },
              ];
            });
            setHistoryIndex((prev) => prev + 1);
          }
        } else if (result.status === "PENDING_APPROVAL") {
          setPendingRequestId(result.requestId || null);
          setStatusMessage(
            result.message ||
              `Waiting for parent approval to visit ${targetDomain}.`,
          );
          setBrowsingState("pending_approval");
          void syncPolicy();
        } else {
          setPendingRequestId(null);
          setBlockCategory(result.category || null);
          setStatusMessage(
            result.message || `${targetDomain} is blocked by parental controls.`,
          );
          setBrowsingState("blocked");
        }
      } catch (error) {
        const msg =
          error instanceof ApiError
            ? error.message
            : "Unable to verify website safety. Make sure your device is paired and backend is running.";
        setStatusMessage(msg);
        setBrowsingState("error");
      }
    },
    [historyIndex, syncPolicy],
  );

  /**
   * Re-checks the currently displayed URL against backend rules
   * (called when parent updates DNS rules or approves/denies a request).
   */
  const recheckCurrentSite = useCallback(async () => {
    const currentUrl = activeUrlRef.current;
    const currentState = browsingStateRef.current;
    if (!currentUrl || currentState === "home") return;

    await navigateTo(currentUrl, {
      pushToHistory: false,
      autoRequest: false,
    });
  }, [navigateTo]);

  /**
   * Initial policy sync + Real-time Socket.IO subscription.
   */
  useEffect(() => {
    void syncPolicy();

    let disconnectSocket: (() => void) | undefined;
    let active = true;

    void connectBrowserSocket({
      onConnectionChange: (connected) => {
        if (active) setSocketConnected(connected);
      },
      onPermissionResolved: (event) => {
        if (!active || event.requestType !== "DOMAIN_ACCESS") return;
        void syncPolicy();

        const currentDom = activeDomainRef.current;
        if (
          currentDom &&
          (currentDom === event.resource ||
            currentDom.endsWith(`.${event.resource}`))
        ) {
          void recheckCurrentSite();
        }
      },
      onDnsPolicyUpdated: () => {
        if (!active) return;
        void syncPolicy();
        // Immediately re-verify current page so live blocks kick in right away
        if (browsingStateRef.current !== "home") {
          void recheckCurrentSite();
        }
      },
    }).then((cleanup) => {
      if (active) {
        disconnectSocket = cleanup;
      } else {
        cleanup();
      }
    });

    return () => {
      active = false;
      disconnectSocket?.();
    };
  }, [recheckCurrentSite, syncPolicy]);

  /**
   * Fallback polling every 5 seconds while waiting for parent approval
   * (guarantees instant unlock even if WebSocket is unavailable).
   */
  useEffect(() => {
    if (browsingState !== "pending_approval" || !activeDomain) return;

    const timer = setInterval(() => {
      void recheckCurrentSite();
    }, 5000);

    return () => clearInterval(timer);
  }, [browsingState, activeDomain, recheckCurrentSite]);

  /**
   * Allows a child on a Blocked page to manually submit an access request with a reason.
   */
  const requestParentAccess = useCallback(
    async (reason?: string) => {
      if (!activeDomain) return;
      setRequestSubmitting(true);
      try {
        const created = await browserApi.requestDomainAccess(
          activeDomain,
          reason || `Child requested access to ${activeDomain}`,
        );
        setPendingRequestId(created.id);
        setStatusMessage(
          `Request sent to your parent for ${activeDomain}. Waiting for approval...`,
        );
        setBrowsingState("pending_approval");
        await syncPolicy();
      } catch (error) {
        Alert.alert(
          "Request Failed",
          error instanceof ApiError
            ? error.message
            : "Could not send permission request to parent.",
        );
      } finally {
        setRequestSubmitting(false);
      }
    },
    [activeDomain, syncPolicy],
  );

  /**
   * Intercepts link navigations triggered inside the WebView.
   * Returns `true` if navigation can proceed immediately (same domain),
   * or `false` while triggering `navigateTo` to verify the new domain first.
   */
  const handleInterceptNavigation = useCallback(
    (nextUrl: string): boolean => {
      if (!nextUrl || nextUrl.startsWith("about:") || nextUrl.startsWith("data:")) {
        return true;
      }
      const nextDomain = extractDomain(nextUrl);
      if (!nextDomain) return false;

      // Allow in-site navigation on the already-verified domain
      if (
        nextDomain === activeDomainRef.current &&
        (browsingStateRef.current === "loading" ||
          browsingStateRef.current === "loaded")
      ) {
        setAddressInput(nextUrl);
        return true;
      }

      // Cross-domain link click -> verify with backend before opening!
      void navigateTo(nextUrl, { pushToHistory: true, autoRequest: true });
      return false;
    },
    [navigateTo],
  );

  // Navigation controls
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const entry = historyStack[targetIndex];
      setHistoryIndex(targetIndex);
      if (entry) {
        void navigateTo(entry.url, { pushToHistory: false, autoRequest: false });
      }
    } else {
      setBrowsingState("home");
      setActiveUrl("");
      setActiveDomain("");
      setAddressInput("");
    }
  }, [historyIndex, historyStack, navigateTo]);

  const goForward = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      const targetIndex = historyIndex + 1;
      const entry = historyStack[targetIndex];
      setHistoryIndex(targetIndex);
      if (entry) {
        void navigateTo(entry.url, { pushToHistory: false, autoRequest: false });
      }
    }
  }, [historyIndex, historyStack, navigateTo]);

  const refresh = useCallback(() => {
    if (browsingState === "home") {
      void syncPolicy();
      return;
    }
    setReloadKey((prev) => prev + 1);
    void recheckCurrentSite();
  }, [browsingState, recheckCurrentSite, syncPolicy]);

  const goHome = useCallback(() => {
    setBrowsingState("home");
    setActiveUrl("");
    setActiveDomain("");
    setAddressInput("");
    setStatusMessage("");
    setBlockCategory(null);
    setPendingRequestId(null);
    void syncPolicy();
  }, [syncPolicy]);

  const handlePageLoaded = useCallback((title?: string) => {
    if (title) setPageTitle(title);
    setBrowsingState((prev) => (prev === "loading" ? "loaded" : prev));
  }, []);

  // List of parent-approved domains to display on the Safe Home screen
  const approvedDomains = (dnsPolicy?.domainRules || [])
    .filter((rule) => rule.action === "ALLOW")
    .map((rule) => rule.domain);

  return {
    // State
    addressInput,
    setAddressInput,
    activeUrl,
    activeDomain,
    pageTitle,
    browsingState,
    statusMessage,
    blockCategory,
    pendingRequestId,
    requestSubmitting,
    dnsPolicy,
    recentRequests,
    approvedDomains,
    socketConnected,
    reloadKey,
    canGoBack,
    canGoForward,

    // Actions
    navigateTo,
    goBack,
    goForward,
    refresh,
    goHome,
    recheckCurrentSite,
    requestParentAccess,
    handleInterceptNavigation,
    handlePageLoaded,
  };
}
