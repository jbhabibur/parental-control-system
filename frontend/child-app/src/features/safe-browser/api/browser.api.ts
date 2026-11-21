/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - API Layer
 * ============================================================================
 * Centralizes all HTTP calls between the Child Safe Browser and Backend API:
 *  - Real-time URL verification (`POST /api/device/browser/check-url`)
 *  - DNS policy & domain rules sync (`GET /api/device/browser/dns-policy`)
 *  - Domain access permission requests (`POST /api/device/permission-requests`)
 *  - Child's own permission request list (`GET /api/device/my-permission-requests`)
 *  - Browser history & security alert logging
 */

import { api } from "../../../lib/api";
import type {
  DeviceDnsPolicy,
  DomainPermissionRequest,
  UrlCheckResult,
} from "../types";

export const browserApi = {
  /**
   * Sends the target URL & domain to the backend Safe Browser filter engine.
   * Backend checks Parent Domain Rules, Keyword/Category rules, and DoH DNS layer.
   */
  checkUrl: async (payload: {
    url: string;
    domain: string;
    pageTitle?: string;
    autoRequest?: boolean;
  }): Promise<UrlCheckResult> => {
    const response = await api.browser.checkUrl(payload);
    return response.data as UrlCheckResult;
  },

  /**
   * Fetches the device's active DNS policy, domain rules, and recent domain requests.
   */
  getDnsPolicy: async (): Promise<{
    dnsPolicy: DeviceDnsPolicy;
    domainRequests: DomainPermissionRequest[];
  }> => {
    const response = await api.browser.getDnsPolicy();
    return response.data as {
      dnsPolicy: DeviceDnsPolicy;
      domainRequests: DomainPermissionRequest[];
    };
  },

  /**
   * Submits an explicit DOMAIN_ACCESS permission request with an optional child reason.
   */
  requestDomainAccess: async (
    domain: string,
    reason?: string,
  ): Promise<DomainPermissionRequest> => {
    const response = await api.permissionRequests.create({
      requestType: "DOMAIN_ACCESS",
      resource: domain,
      ...(reason ? { reason } : {}),
    });
    return response.data as DomainPermissionRequest;
  },

  /**
   * Fetches the child's own permission requests (used for polling approval status).
   */
  getMyDomainRequests: async (): Promise<DomainPermissionRequest[]> => {
    const response = await api.permissionRequests.mine();
    const list = Array.isArray(response.data)
      ? (response.data as DomainPermissionRequest[])
      : [];
    return list.filter((item) => item.requestType === "DOMAIN_ACCESS");
  },

  /**
   * Records a page visit (or title update) in backend BrowserHistory.
   */
  recordHistory: async (payload: {
    url: string;
    domain: string;
    pageTitle?: string;
    blocked?: boolean;
    category?: string;
  }) => {
    return api.browserHistory.record({
      ...payload,
      visitedAt: new Date().toISOString(),
    });
  },
};
