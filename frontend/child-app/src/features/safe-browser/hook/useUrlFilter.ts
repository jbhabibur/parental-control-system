/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - URL Filtering & SafeSearch Helper Hook
 * ============================================================================
 * Pure utility functions for:
 *  1. Normalizing address bar input (URL vs search query)
 *  2. Enforcing SafeSearch query parameters on major search engines
 *  3. Extracting clean lowercase domains
 *  4. Fast client-side prohibited keyword pre-check
 */

const LOCAL_PROHIBITED_KEYWORDS = [
  "porn",
  "pornhub",
  "xvideos",
  "xnxx",
  "onlyfans",
  "hentai",
  "nsfw",
  "xxx",
  "gambling",
  "casino",
  "bet365",
  "1xbet",
  "phishing",
  "malware",
];

/**
 * Extracts a clean lowercase domain without leading "www." from any URL string.
 */
export function extractDomain(rawUrl: string): string {
  const trimmed = rawUrl.trim().toLowerCase();
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
}

/**
 * Returns true if the input looks like a domain or URL (rather than a search query).
 */
export function looksLikeUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/.*)?$/i.test(trimmed);
}

/**
 * Appends SafeSearch parameters to major search engines (Google, Bing, DuckDuckGo)
 * when SafeSearch enforcement is enabled by the parent's DNS policy.
 */
export function enforceSafeSearchOnUrl(
  rawUrl: string,
  safeSearchEnabled: boolean,
): string {
  if (!safeSearchEnabled) return rawUrl;

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("google.")) {
      parsed.searchParams.set("safe", "active");
    } else if (host.includes("bing.com")) {
      parsed.searchParams.set("adlt", "strict");
    } else if (host.includes("duckduckgo.com")) {
      parsed.searchParams.set("kp", "1");
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Converts user input from the address bar into a valid HTTPS URL.
 * - Domain/URL input -> normalized HTTPS URL (with SafeSearch if search engine)
 * - Plain text query -> Google search URL with SafeSearch enforced
 */
export function normalizeInputToUrl(
  input: string,
  safeSearchEnabled = true,
): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (looksLikeUrl(trimmed)) {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return enforceSafeSearchOnUrl(withProtocol, safeSearchEnabled);
  }

  const encoded = encodeURIComponent(trimmed);
  const safeParam = safeSearchEnabled ? "&safe=active" : "";
  return `https://www.google.com/search?q=${encoded}${safeParam}`;
}

/**
 * Fast client-side check for obvious prohibited keywords.
 * (Backend still enforces authoritative rules, DoH DNS checks, and logging.)
 */
export function findLocalProhibitedKeyword(input: string): string | null {
  const lower = input.toLowerCase();
  for (const word of LOCAL_PROHIBITED_KEYWORDS) {
    if (lower.includes(word)) return word;
  }
  return null;
}

/**
 * Hook exposing URL helper functions cleanly to components.
 */
export function useUrlFilter() {
  return {
    extractDomain,
    looksLikeUrl,
    enforceSafeSearchOnUrl,
    normalizeInputToUrl,
    findLocalProhibitedKeyword,
  };
}
