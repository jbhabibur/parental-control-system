/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - Main Screen Component
 * ============================================================================
 * Clean, easy-to-read screen assembling all modular Safe Browser sub-features:
 *  - Live DNS & Socket status bar
 *  - AddressBar (top URL/search input)
 *  - Content Viewport (SafeHomeView | Checking | WebViewport | BlockedView | PendingApprovalView | Error)
 *  - BrowserToolbar (bottom Back / Forward / Refresh / Home controls)
 */

import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { useSafeBrowser } from "./hook/useSafeBrowser";
import { BROWSER_COLORS, safeBrowserStyles } from "./style/safe-browser.styles";

import { AddressBar } from "./features/address-bar/AddressBar";
import { BrowserToolbar } from "./features/browser-toolbar/BrowserToolbar";
import { BlockedView } from "./features/blocked-view/BlockedView";
import { PendingApprovalView } from "./features/pending-approval/PendingApprovalView";
import { SafeHomeView } from "./features/safe-home/SafeHomeView";
import { WebViewport } from "./features/web-viewport/WebViewport";

export function SafeBrowserScreen() {
  const {
    addressInput,
    setAddressInput,
    activeUrl,
    activeDomain,
    browsingState,
    statusMessage,
    blockCategory,
    requestSubmitting,
    dnsPolicy,
    recentRequests,
    approvedDomains,
    socketConnected,
    reloadKey,
    canGoBack,
    canGoForward,
    navigateTo,
    goBack,
    goForward,
    refresh,
    goHome,
    recheckCurrentSite,
    requestParentAccess,
    handleInterceptNavigation,
    handlePageLoaded,
  } = useSafeBrowser();

  const isBusy = browsingState === "checking" || browsingState === "loading";
  const isSecure = activeUrl.startsWith("https://");

  return (
    <SafeAreaView style={safeBrowserStyles.root} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      {/* 1. Live Parental Protection Status Strip */}
      <View style={safeBrowserStyles.statusStrip}>
        <View style={safeBrowserStyles.statusLeft}>
          <View
            style={[
              safeBrowserStyles.liveDot,
              {
                backgroundColor: socketConnected
                  ? BROWSER_COLORS.green
                  : BROWSER_COLORS.amber,
              },
            ]}
          />
          <Text style={safeBrowserStyles.statusText}>
            {socketConnected ? "Parent Sync Live" : "Parent Policy Active"}
          </Text>
        </View>
        <Text style={safeBrowserStyles.statusBadge}>
          {dnsPolicy?.safeSearch === false ? "DNS Filter" : "DNS + SafeSearch"}
        </Text>
      </View>

      {/* 2. Top Address Bar */}
      <AddressBar
        value={addressInput}
        onChangeText={setAddressInput}
        onSubmit={() => void navigateTo(addressInput)}
        onExitBrowser={() =>
          router.canGoBack() ? router.back() : router.replace("/monitoring-status")
        }
        isBusy={isBusy}
        isSecure={isSecure}
      />

      {/* 3. Main Content Area (switches cleanly by browsingState) */}
      <View style={safeBrowserStyles.viewportContainer}>
        {browsingState === "home" && (
          <SafeHomeView
            dnsPolicy={dnsPolicy}
            approvedDomains={approvedDomains}
            recentRequests={recentRequests}
            onNavigate={(url) => void navigateTo(url)}
          />
        )}

        {browsingState === "checking" && (
          <View style={safeBrowserStyles.checkingContainer}>
            <ActivityIndicator size="large" color={BROWSER_COLORS.blue} />
            <Text style={safeBrowserStyles.checkingTitle}>
              Checking Website Safety...
            </Text>
            <Text style={safeBrowserStyles.checkingSubtitle}>
              Verifying {activeDomain} with DNS protection & parent rules
            </Text>
          </View>
        )}

        {(browsingState === "loading" || browsingState === "loaded") &&
          !!activeUrl && (
            <WebViewport
              url={activeUrl}
              reloadKey={reloadKey}
              isLoading={browsingState === "loading"}
              onShouldStartLoad={handleInterceptNavigation}
              onLoadEnd={handlePageLoaded}
            />
          )}

        {browsingState === "blocked" && (
          <BlockedView
            domain={activeDomain}
            message={statusMessage}
            category={blockCategory}
            submitting={requestSubmitting}
            onRequestAccess={(reason) => void requestParentAccess(reason)}
            onGoHome={goHome}
          />
        )}

        {browsingState === "pending_approval" && (
          <PendingApprovalView
            domain={activeDomain}
            message={statusMessage}
            socketConnected={socketConnected}
            onCheckNow={() => void recheckCurrentSite()}
            onGoHome={goHome}
          />
        )}

        {browsingState === "error" && (
          <View style={safeBrowserStyles.errorContainer}>
            <Text style={safeBrowserStyles.errorIcon}>⚠️</Text>
            <Text style={safeBrowserStyles.errorTitle}>
              Could Not Verify Website
            </Text>
            <Text style={safeBrowserStyles.errorText}>{statusMessage}</Text>
            <TouchableOpacity
              onPress={() => void recheckCurrentSite()}
              style={safeBrowserStyles.retryBtn}
            >
              <Text style={safeBrowserStyles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 4. Bottom Browser Navigation Toolbar */}
      <BrowserToolbar
        canGoBack={canGoBack || browsingState !== "home"}
        canGoForward={canGoForward}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={goHome}
      />
    </SafeAreaView>
  );
}

export default SafeBrowserScreen;
