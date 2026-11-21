/**
 * ============================================================================
 * Safe Browser Filtering & DNS Enforcement Service
 * ============================================================================
 * Core engine synchronizing the Child Safe Browser with Parent DNS rules,
 * encrypted DoH filtering, keyword/category filtering, browsing history,
 * security alerts, notifications, and real-time parent approval requests.
 */

import { prisma } from "../config/database.js";
import { emitToParent } from "../config/socket.js";
import {
  normalizeDomain,
  findMatchingDomainRule,
  analyzeContentKeywords,
  checkDoHDnsLayer,
} from "../utils/domain.util.js";

const DEFAULT_DOH_ENDPOINT = "https://family.cloudflare-dns.com/dns-query";

/**
 * Helper: Creates a SecurityAlert + In-App Notification for the parent
 * and pushes real-time Socket.IO events (`domain:blocked`, `alert:new`).
 */
const notifyParentBlockedAttempt = async ({
  parentId,
  childId,
  childName,
  deviceId,
  deviceName,
  url,
  domain,
  reason,
  category,
  alertType = "PROHIBITED_DOMAIN",
  severity = "HIGH",
}) => {
  // 1. Persist SecurityAlert
  const alert = await prisma.securityAlert.create({
    data: {
      childId,
      deviceId,
      type: alertType,
      severity,
      title: `Blocked website attempt: ${domain}`,
      description: `${childName} (${deviceName}) attempted to visit ${domain}. Reason: ${reason}${category ? ` (${category})` : ""}.`,
      metadata: {
        url,
        domain,
        reason,
        category: category || null,
      },
    },
  });

  // 2. Persist Parent Notification
  if (parentId) {
    const notification = await prisma.notification.create({
      data: {
        userId: parentId,
        alertId: alert.id,
        title: `Blocked Site Attempt: ${domain}`,
        body: `${childName} tried to open ${domain} on ${deviceName} (${category || reason}).`,
        channel: "IN_APP",
      },
    });

    // 3. Emit real-time Socket.IO events to Parent App
    emitToParent(parentId, "domain:blocked", {
      deviceId,
      deviceName,
      childId,
      childName,
      url,
      domain,
      reason,
      category,
      alertId: alert.id,
      notificationId: notification.id,
      timestamp: new Date().toISOString(),
    });

    emitToParent(parentId, "alert:new", alert);
  }

  return alert;
};

/**
 * Evaluates a URL requested by the Child Safe Browser against:
 *  1. Device DNS Policy (enabled/disabled, SafeSearch, DoH/DoT)
 *  2. Parent Domain Rules (exact & subdomain ALLOW / BLOCK)
 *  3. Prohibited Category & Keyword Analysis
 *  4. Encrypted DNS-over-HTTPS (DoH) DNS-layer filtering
 *  5. Default-Deny Approval Flow (creates DOMAIN_ACCESS request + notifies Parent)
 *
 * Also automatically logs every check into `BrowserHistory`.
 */
export const checkUrlForDevice = async (deviceId, childId, payload) => {
  const { url, pageTitle = null, autoRequest = true } = payload;
  const normalizedDomain = normalizeDomain(payload.domain || url);

  if (!normalizedDomain) {
    const error = new Error("Unable to extract a valid domain from URL");
    error.statusCode = 400;
    throw error;
  }

  // Load device, child/parent info, and DNS policy + domain rules
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          parentId: true,
        },
      },
      dnsPolicy: {
        include: {
          domainRules: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!device || device.childId !== childId) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  const parentId = device.child?.parentId || null;
  const childName = device.child?.name || "Child";
  const policy = device.dnsPolicy;

  // Effective DNS policy flags (defaults to protected mode if not configured yet)
  const filteringEnabled = policy ? policy.enabled : true;
  const safeSearch = policy ? policy.safeSearch : true;
  const dohEndpoint = policy?.dohEndpoint || DEFAULT_DOH_ENDPOINT;
  const provider = policy?.provider || "ChildSafe Family DNS";
  const domainRules = policy?.domainRules || [];

  // ------------------------------------------------------------------
  // STEP 1: Check explicit Parent Domain Rules first (highest priority)
  // ------------------------------------------------------------------
  const matchedRule = findMatchingDomainRule(normalizedDomain, domainRules);

  if (matchedRule) {
    if (matchedRule.action === "ALLOW") {
      await prisma.browserHistory.create({
        data: {
          deviceId,
          childId,
          url,
          domain: normalizedDomain,
          pageTitle,
          blocked: false,
          category: matchedRule.category?.name || "APPROVED",
          visitedAt: new Date(),
        },
      });

      if (parentId) {
        emitToParent(parentId, "browser:activity", {
          deviceId,
          deviceName: device.deviceName,
          childId,
          childName,
          url,
          domain: normalizedDomain,
          blocked: false,
          category: matchedRule.category?.name || "APPROVED",
          visitedAt: new Date().toISOString(),
        });
      }

      return {
        allowed: true,
        status: "ALLOWED",
        reason: "allowed_by_parent_rule",
        domain: normalizedDomain,
        category: matchedRule.category?.name || "APPROVED",
        safeSearch,
        dohEndpoint,
        provider,
      };
    }

    // Explicitly BLOCKED by Parent
    const categoryName = matchedRule.category?.name || "Parent Blocked";
    await prisma.browserHistory.create({
      data: {
        deviceId,
        childId,
        url,
        domain: normalizedDomain,
        pageTitle,
        blocked: true,
        category: categoryName,
        visitedAt: new Date(),
      },
    });

    await notifyParentBlockedAttempt({
      parentId,
      childId,
      childName,
      deviceId,
      deviceName: device.deviceName,
      url,
      domain: normalizedDomain,
      reason: "Blocked by parent domain rule",
      category: categoryName,
      alertType: "PROHIBITED_DOMAIN",
      severity: "HIGH",
    });

    return {
      allowed: false,
      status: "BLOCKED",
      reason: "blocked_by_parent_rule",
      message: `${normalizedDomain} is blocked by your parent.`,
      domain: normalizedDomain,
      category: categoryName,
      safeSearch,
      dohEndpoint,
      provider,
    };
  }

  // ------------------------------------------------------------------
  // STEP 2: If DNS filtering is turned OFF by parent, allow non-blocked sites
  // ------------------------------------------------------------------
  if (!filteringEnabled) {
    await prisma.browserHistory.create({
      data: {
        deviceId,
        childId,
        url,
        domain: normalizedDomain,
        pageTitle,
        blocked: false,
        category: "UNFILTERED",
        visitedAt: new Date(),
      },
    });

    return {
      allowed: true,
      status: "ALLOWED",
      reason: "dns_filtering_disabled",
      domain: normalizedDomain,
      category: "UNFILTERED",
      safeSearch,
      dohEndpoint,
      provider,
    };
  }

  // ------------------------------------------------------------------
  // STEP 3: Real-time Keyword & Content Category Analysis
  // ------------------------------------------------------------------
  const keywordMatch = analyzeContentKeywords(
    url,
    normalizedDomain,
    pageTitle || "",
  );

  if (keywordMatch.matched) {
    await prisma.browserHistory.create({
      data: {
        deviceId,
        childId,
        url,
        domain: normalizedDomain,
        pageTitle,
        blocked: true,
        category: keywordMatch.category,
        visitedAt: new Date(),
      },
    });

    await notifyParentBlockedAttempt({
      parentId,
      childId,
      childName,
      deviceId,
      deviceName: device.deviceName,
      url,
      domain: normalizedDomain,
      reason: `Matched prohibited keyword (${keywordMatch.keyword})`,
      category: keywordMatch.category,
      alertType: keywordMatch.alertType,
      severity: keywordMatch.severity,
    });

    return {
      allowed: false,
      status: "BLOCKED",
      reason: "prohibited_content",
      message: `Blocked: ${keywordMatch.category} is restricted for your safety.`,
      domain: normalizedDomain,
      category: keywordMatch.category,
      matchedKeyword: keywordMatch.keyword,
      safeSearch,
      dohEndpoint,
      provider,
    };
  }

  // ------------------------------------------------------------------
  // STEP 4: Encrypted DNS-over-HTTPS (DoH) Network-Layer Check
  // ------------------------------------------------------------------
  const dnsCheck = await checkDoHDnsLayer(normalizedDomain, dohEndpoint);

  if (dnsCheck.blocked) {
    await prisma.browserHistory.create({
      data: {
        deviceId,
        childId,
        url,
        domain: normalizedDomain,
        pageTitle,
        blocked: true,
        category: "DNS_FILTERED",
        visitedAt: new Date(),
      },
    });

    await notifyParentBlockedAttempt({
      parentId,
      childId,
      childName,
      deviceId,
      deviceName: device.deviceName,
      url,
      domain: normalizedDomain,
      reason: `Blocked at DNS layer by ${provider}`,
      category: "DNS_FILTERED",
      alertType: "PROHIBITED_DOMAIN",
      severity: "HIGH",
    });

    return {
      allowed: false,
      status: "BLOCKED",
      reason: "dns_level_blocked",
      message: `${normalizedDomain} was blocked at the DNS protection layer.`,
      domain: normalizedDomain,
      category: "DNS_FILTERED",
      safeSearch,
      dohEndpoint,
      provider,
    };
  }

  // ------------------------------------------------------------------
  // STEP 5: Default-Deny Approval Flow (Requires Parent Permission)
  // ------------------------------------------------------------------
  let permissionRequest = await prisma.permissionRequest.findFirst({
    where: {
      deviceId,
      childId,
      requestType: "DOMAIN_ACCESS",
      resource: normalizedDomain,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!permissionRequest && autoRequest) {
    permissionRequest = await prisma.permissionRequest.create({
      data: {
        childId,
        deviceId,
        requestType: "DOMAIN_ACCESS",
        resource: normalizedDomain,
        reason: `Requested website access from Safe Browser: ${url}`,
      },
    });

    // Notify parent in DB + via Socket.IO in real time
    if (parentId) {
      await prisma.notification.create({
        data: {
          userId: parentId,
          title: `Website Approval Needed: ${normalizedDomain}`,
          body: `${childName} wants to visit ${normalizedDomain} on ${device.deviceName}. Approve or block from Safe Browser Dashboard.`,
          channel: "IN_APP",
        },
      });

      emitToParent(parentId, "permission:requested", {
        ...permissionRequest,
        child: { id: childId, name: childName },
        device: { id: deviceId, deviceName: device.deviceName },
      });
    }
  }

  // Record the blocked/pending attempt in BrowserHistory
  await prisma.browserHistory.create({
    data: {
      deviceId,
      childId,
      url,
      domain: normalizedDomain,
      pageTitle,
      blocked: true,
      category: "PENDING_APPROVAL",
      visitedAt: new Date(),
    },
  });

  return {
    allowed: false,
    status: "PENDING_APPROVAL",
    reason: "parent_approval_required",
    message: `Waiting for parent approval to visit ${normalizedDomain}.`,
    domain: normalizedDomain,
    requestId: permissionRequest?.id || null,
    safeSearch,
    dohEndpoint,
    provider,
  };
};

/**
 * Returns the active DNS Policy, Domain Rules, and recent DOMAIN_ACCESS requests
 * for the authenticated Child Device so the Safe Browser stays synchronized.
 */
export const getDeviceBrowserPolicy = async (deviceId, childId) => {
  const [policy, domainRequests] = await Promise.all([
    prisma.dnsPolicy.findUnique({
      where: { deviceId },
      include: {
        domainRules: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.permissionRequest.findMany({
      where: {
        deviceId,
        childId,
        requestType: "DOMAIN_ACCESS",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return {
    dnsPolicy: policy || {
      id: null,
      deviceId,
      enabled: true,
      provider: "ChildSafe Family DNS",
      dohEndpoint: DEFAULT_DOH_ENDPOINT,
      dotEndpoint: "family.cloudflare-dns.com",
      safeSearch: true,
      domainRules: [],
    },
    domainRequests,
  };
};

/**
 * Returns a complete Safe Browser Dashboard summary for a Parent's child device:
 * DNS policy, domain rules, browsing history, pending domain requests, and stats.
 */
export const getParentBrowserSummary = async (parentId, deviceId) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      child: {
        parentId,
        role: "CHILD",
      },
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
        },
      },
      dnsPolicy: {
        include: {
          domainRules: {
            include: { category: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  const [history, domainRequests] = await Promise.all([
    prisma.browserHistory.findMany({
      where: { deviceId },
      orderBy: { visitedAt: "desc" },
      take: 100,
    }),
    prisma.permissionRequest.findMany({
      where: {
        deviceId,
        requestType: "DOMAIN_ACCESS",
      },
      include: {
        child: { select: { id: true, name: true } },
        device: { select: { id: true, deviceName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const rules = device.dnsPolicy?.domainRules || [];
  const pendingRequests = domainRequests.filter((r) => r.status === "PENDING");
  const blockedAttempts = history.filter((h) => h.blocked).length;
  const allowedDomains = rules.filter((r) => r.action === "ALLOW").length;
  const blockedDomains = rules.filter((r) => r.action === "BLOCK").length;

  return {
    device: {
      id: device.id,
      deviceName: device.deviceName,
      platform: device.platform,
      status: device.status,
      childId: device.childId,
      child: device.child,
    },
    dnsPolicy: device.dnsPolicy || null,
    domainRules: rules,
    history,
    domainRequests,
    stats: {
      totalVisits: history.length,
      blockedAttempts,
      allowedDomains,
      blockedDomains,
      pendingCount: pendingRequests.length,
    },
  };
};
