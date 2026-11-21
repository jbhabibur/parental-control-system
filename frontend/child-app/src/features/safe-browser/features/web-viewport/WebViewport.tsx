/**
 * ============================================================================
 * Sub-Feature: Web Viewport - Cross-Platform Renderer
 * ============================================================================
 * Renders the verified website safely:
 *  - On Android / iOS: Uses `react-native-webview` with `onShouldStartLoadWithRequest`
 *    so every single link click is intercepted and checked against parent rules.
 *  - On Web (`expo start --web`): Uses an embedded `<iframe>` with an optional
 *    "Open Tab" button for websites that disallow iframe embedding (X-Frame-Options).
 */

import React from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { BROWSER_COLORS } from "../../style/safe-browser.styles";
import { webViewportStyles } from "./web-viewport.styles";

interface WebViewportProps {
  url: string;
  reloadKey: number;
  isLoading: boolean;
  onShouldStartLoad: (nextUrl: string) => boolean;
  onLoadEnd: (title?: string) => void;
}

export function WebViewport({
  url,
  reloadKey,
  isLoading,
  onShouldStartLoad,
  onLoadEnd,
}: WebViewportProps) {
  // Web platform renderer (for side-by-side browser testing on desktop)
  if (Platform.OS === "web") {
    return (
      <View style={webViewportStyles.container}>
        <View style={webViewportStyles.webBanner}>
          <Text style={webViewportStyles.webBannerText} numberOfLines={1}>
            ✅ Approved & Verified: {url}
          </Text>
          <TouchableOpacity
            onPress={() => void Linking.openURL(url)}
            style={webViewportStyles.openExternalBtn}
          >
            <Text style={webViewportStyles.openExternalText}>Open in Tab ↗</Text>
          </TouchableOpacity>
        </View>
        {React.createElement("iframe", {
          key: `${url}-${reloadKey}`,
          src: url,
          title: "ChildSafe Web Viewport",
          onLoad: () => onLoadEnd(),
          style: {
            width: "100%",
            height: "100%",
            border: "none",
            flex: 1,
          },
          sandbox:
            "allow-scripts allow-same-origin allow-forms allow-popups",
        })}
      </View>
    );
  }

  // Native iOS / Android WebView with strict navigation interception
  return (
    <View style={webViewportStyles.container}>
      {isLoading && (
        <View style={webViewportStyles.loadingOverlay}>
          <ActivityIndicator size="small" color={BROWSER_COLORS.white} />
          <Text style={webViewportStyles.loadingText}>
            Loading verified website...
          </Text>
        </View>
      )}

      <WebView
        key={`${url}-${reloadKey}`}
        source={{ uri: url }}
        style={webViewportStyles.webview}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) =>
          onShouldStartLoad(request.url)
        }
        onLoadEnd={(event) => {
          onLoadEnd(event.nativeEvent?.title);
        }}
      />
    </View>
  );
}
