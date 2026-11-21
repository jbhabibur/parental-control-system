/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - Shared Type Definitions
 * ============================================================================
 */

export interface DeviceOption {
  id: string;
  deviceName: string;
  platform: string;
  status: string;
  childId: string;
  child?: {
    id: string;
    name: string;
  };
}

export interface DomainRuleItem {
  id: string;
  domain: string;
  action: "ALLOW" | "BLOCK";
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

export interface DnsPolicyConfig {
  id: string;
  deviceId: string;
  enabled: boolean;
  provider?: string | null;
  dohEndpoint?: string | null;
  dotEndpoint?: string | null;
  safeSearch: boolean;
}

export interface BrowsingHistoryItem {
  id: string;
  url: string;
  domain: string;
  pageTitle?: string | null;
  blocked: boolean;
  category?: string | null;
  visitedAt: string;
}

export interface DomainAccessRequest {
  id: string;
  childId: string;
  deviceId: string;
  requestType: string;
  resource: string;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";
  reviewedAt?: string | null;
  createdAt: string;
  child?: {
    id: string;
    name: string;
  };
  device?: {
    id: string;
    deviceName: string;
  };
}

export interface BrowserStats {
  totalVisits: number;
  blockedAttempts: number;
  allowedDomains: number;
  blockedDomains: number;
  pendingCount: number;
}

export interface BrowserSummaryPayload {
  device: DeviceOption;
  dnsPolicy: DnsPolicyConfig | null;
  domainRules: DomainRuleItem[];
  history: BrowsingHistoryItem[];
  domainRequests: DomainAccessRequest[];
  stats: BrowserStats;
}

export interface LiveBannerNotice {
  type: "request" | "blocked" | "activity";
  title: string;
  body: string;
  timestamp: string;
}
