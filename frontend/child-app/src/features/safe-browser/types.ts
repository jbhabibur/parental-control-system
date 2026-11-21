/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - Shared Type Definitions
 * ============================================================================
 * All TypeScript types used across the Child Safe Browser feature.
 */

export type BrowsingState =
  | "home"
  | "checking"
  | "loading"
  | "loaded"
  | "blocked"
  | "pending_approval"
  | "error";

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
  createdAt?: string;
}

export interface DeviceDnsPolicy {
  id: string | null;
  deviceId: string;
  enabled: boolean;
  provider?: string | null;
  dohEndpoint?: string | null;
  dotEndpoint?: string | null;
  safeSearch: boolean;
  domainRules: DomainRuleItem[];
}

export interface DomainPermissionRequest {
  id: string;
  requestType: string;
  resource: string;
  reason?: string | null;
  status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";
  reviewedAt?: string | null;
  createdAt: string;
}

export interface UrlCheckResult {
  allowed: boolean;
  status: "ALLOWED" | "BLOCKED" | "PENDING_APPROVAL";
  reason: string;
  message?: string;
  domain: string;
  category?: string | null;
  matchedKeyword?: string | null;
  requestId?: string | null;
  safeSearch: boolean;
  dohEndpoint?: string | null;
  provider?: string | null;
}

export interface HistoryEntry {
  url: string;
  domain: string;
  title?: string;
  timestamp: number;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  domain: string;
  url: string;
  icon: string;
  description: string;
}
