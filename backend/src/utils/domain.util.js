/**
 * ============================================================================
 * Domain Normalization, Content Filtering & DNS-over-HTTPS (DoH) Utilities
 * ============================================================================
 * Shared pure utilities used by the Safe Browser filter engine, DNS policy
 * service, and domain permission request workflows.
 */

// Categorized prohibited keywords for real-time content & URL filtering
const PROHIBITED_CATEGORIES = [
  {
    category: "Adult Content",
    alertType: "PROHIBITED_DOMAIN",
    severity: "CRITICAL",
    keywords: [
      "porn",
      "pornhub",
      "xvideos",
      "xnxx",
      "xhamster",
      "redtube",
      "onlyfans",
      "hentai",
      "nsfw",
      "xxx",
      "adult-video",
      "escort",
    ],
  },
  {
    category: "Gambling & Betting",
    alertType: "PROHIBITED_DOMAIN",
    severity: "HIGH",
    keywords: [
      "gambling",
      "casino",
      "bet365",
      "1xbet",
      "betway",
      "sportsbet",
      "betting",
      "online-poker",
      "jackpot-slots",
      "roulette",
    ],
  },
  {
    category: "Phishing & Scams",
    alertType: "PHISHING_DETECTED",
    severity: "CRITICAL",
    keywords: [
      "phishing",
      "free-robux-hack",
      "verify-bank-login",
      "steal-password",
      "account-suspended-verify",
    ],
  },
  {
    category: "Malware & Exploits",
    alertType: "MALWARE_DETECTED",
    severity: "CRITICAL",
    keywords: [
      "malware",
      "ransomware",
      "trojan-download",
      "keygen-crack",
      "spyware",
    ],
  },
  {
    category: "Violence & Drugs",
    alertType: "PROHIBITED_DOMAIN",
    severity: "HIGH",
    keywords: [
      "gore-video",
      "bestgore",
      "darkweb-market",
      "buy-weapons",
      "buy-drugs",
    ],
  },
];

/**
 * Normalizes any URL or raw domain input into a clean lowercase hostname
 * without protocol, path, port, or leading "www.".
 *
 * Examples:
 *  - "https://www.YouTube.com/watch?v=1" -> "youtube.com"
 *  - "m.facebook.com/home"              -> "m.facebook.com"
 *  - "  EXAMPLE.ORG.  "                 -> "example.org"
 */
export const normalizeDomain = (input) => {
  if (!input || typeof input !== "string") return "";

  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "").replace(/\.$/, "");
  } catch {
    return trimmed
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#:]/)[0]
      .replace(/\.$/, "");
  }
};

/**
 * Checks if `targetDomain` matches `ruleDomain` either exactly
 * or as a subdomain (e.g., "m.facebook.com" matches rule "facebook.com").
 */
export const matchesDomainRule = (targetDomain, ruleDomain) => {
  const cleanTarget = normalizeDomain(targetDomain);
  const cleanRule = normalizeDomain(ruleDomain);

  if (!cleanTarget || !cleanRule) return false;
  return cleanTarget === cleanRule || cleanTarget.endsWith(`.${cleanRule}`);
};

/**
 * Finds the most specific matching DomainRule for a target domain.
 * If both "youtube.com" (BLOCK) and "kids.youtube.com" (ALLOW) exist,
 * the longer/more specific rule ("kids.youtube.com") wins.
 */
export const findMatchingDomainRule = (targetDomain, rules = []) => {
  const cleanTarget = normalizeDomain(targetDomain);
  if (!cleanTarget || !Array.isArray(rules) || rules.length === 0) return null;

  let bestMatch = null;
  let bestLength = -1;

  for (const rule of rules) {
    const cleanRule = normalizeDomain(rule.domain);
    if (matchesDomainRule(cleanTarget, cleanRule)) {
      if (cleanRule.length > bestLength) {
        bestMatch = rule;
        bestLength = cleanRule.length;
      }
    }
  }

  return bestMatch;
};

/**
 * Analyzes URL, domain, and optional page title against prohibited categories
 * and keywords (Adult, Gambling, Phishing, Malware, Violence/Drugs).
 */
export const analyzeContentKeywords = (url = "", domain = "", pageTitle = "") => {
  const haystack = `${url} ${domain} ${pageTitle}`.toLowerCase();

  for (const group of PROHIBITED_CATEGORIES) {
    for (const keyword of group.keywords) {
      if (haystack.includes(keyword)) {
        return {
          matched: true,
          category: group.category,
          keyword,
          alertType: group.alertType,
          severity: group.severity,
        };
      }
    }
  }

  return {
    matched: false,
    category: null,
    keyword: null,
    alertType: null,
    severity: null,
  };
};

/**
 * Performs an encrypted DNS-over-HTTPS (DoH) lookup against a family-safe
 * resolver (e.g., Cloudflare Family 1.1.1.3, NextDNS, SafeGuard).
 *
 * Family-safe DoH resolvers sinkhole blocked domains by returning 0.0.0.0 / ::
 * or DNS Status 3 (NXDOMAIN) / 5 (REFUSED).
 *
 * Uses a short 1500ms timeout and fails open on network timeout so local/offline
 * testing never hangs.
 */
export const checkDoHDnsLayer = async (domain, dohEndpoint) => {
  const cleanDomain = normalizeDomain(domain);
  if (!cleanDomain || !dohEndpoint) {
    return { blocked: false, resolvedIps: [], providerStatus: "SKIPPED" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const queryUrl = new URL(dohEndpoint);
    queryUrl.searchParams.set("name", cleanDomain);
    queryUrl.searchParams.set("type", "A");

    const response = await fetch(queryUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/dns-json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { blocked: false, resolvedIps: [], providerStatus: "UNAVAILABLE" };
    }

    const data = await response.json();
    const answers = Array.isArray(data?.Answer) ? data.Answer : [];
    const resolvedIps = answers
      .map((entry) => String(entry?.data || "").trim())
      .filter(Boolean);

    // Family-safe DNS filters sinkhole prohibited domains to 0.0.0.0 or ::
    const isSinkholed = resolvedIps.some(
      (ip) => ip === "0.0.0.0" || ip === "::" || ip === "127.0.0.1",
    );

    if (isSinkholed) {
      return {
        blocked: true,
        resolvedIps,
        providerStatus: "SINKHOLED_BY_DNS",
      };
    }

    return {
      blocked: false,
      resolvedIps,
      providerStatus: "CLEAN",
    };
  } catch {
    // Graceful fallback if external DoH resolver is unreachable
    return { blocked: false, resolvedIps: [], providerStatus: "FALLBACK" };
  } finally {
    clearTimeout(timeoutId);
  }
};
