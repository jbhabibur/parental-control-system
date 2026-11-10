import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type AuthKind = "user" | "device";
export type JsonRecord = Record<string, unknown>;
export type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
};
type TokenResponse = ApiResult & { accessToken: string; refreshToken: string };

export class ApiError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const apiBaseUrl = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"
)
  .trim()
  .replace(/\/+$/, "");
const accessKey = "parent-control.user.access";
const refreshKey = "parent-control.user.refresh";
let refreshInFlight: Promise<boolean> | undefined;

async function getStored(key: string) {
  if (Platform.OS === "web") {
    return typeof localStorage === "undefined"
      ? null
      : localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setStored(key: string, value: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeStored(key: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function saveTokens(
  kind: AuthKind,
  tokens: { accessToken: string; refreshToken: string },
) {
  const keys = tokenKeys(kind);
  await Promise.all([
    setStored(keys.access, tokens.accessToken),
    setStored(keys.refresh, tokens.refreshToken),
  ]);
}

export async function clearTokens(kind: AuthKind = "device") {
  const keys = tokenKeys(kind);
  await Promise.all([removeStored(keys.access), removeStored(keys.refresh)]);
}

export async function hasAccessToken(kind: AuthKind = "device") {
  return Boolean(await getStored(tokenKeys(kind).access));
}

export async function getRefreshToken(kind: AuthKind = "device") {
  return getStored(tokenKeys(kind).refresh);
}

export async function getOrCreateDeviceIdentifier() {
  const key = "parent-control.device.identifier";
  const existing = await getStored(key);
  if (existing) return existing;
  const identifier = `child-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  await setStored(key, identifier);
  return identifier;
}

function tokenKeys(kind: AuthKind) {
  return kind === "user"
    ? { access: accessKey, refresh: refreshKey }
    : {
        access: "parent-control.device.access",
        refresh: "parent-control.device.refresh",
      };
}

function urlFor(path: string) {
  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

async function rawRequest<T>(
  path: string,
  options: RequestInit,
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(urlFor(path), { ...options, headers });
  } catch {
    throw new ApiError(
      `Could not connect to ${apiBaseUrl}. Set EXPO_PUBLIC_API_URL to a backend address reachable from this device.`,
      0,
    );
  }

  const text = await response.text();
  let payload: ApiResult;
  try {
    payload = text ? (JSON.parse(text) as ApiResult) : { success: response.ok };
  } catch {
    payload = { success: false, message: text || response.statusText };
  }
  if (!response.ok) {
    throw new ApiError(
      typeof payload.message === "string"
        ? payload.message
        : response.statusText,
      response.status,
      payload.errors,
    );
  }
  return payload as T;
}

async function refreshAccessToken(kind: AuthKind) {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const refreshToken = await getStored(tokenKeys(kind).refresh);
    if (!refreshToken) return false;
    try {
      const path = kind === "user" ? "auth/refresh" : "device-refresh";
      const result = await rawRequest<TokenResponse>(path, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      if (!result.accessToken || !result.refreshToken) return false;
      await saveTokens(kind, result);
      return true;
    } catch {
      await clearTokens(kind);
      return false;
    }
  })();
  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = undefined;
  }
}

export async function request<T = ApiResult>(
  path: string,
  options: RequestInit = {},
  auth: AuthKind | null = null,
  retried = false,
): Promise<T> {
  const token = auth ? await getStored(tokenKeys(auth).access) : null;
  try {
    return await rawRequest<T>(path, options, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && auth && !retried) {
      if (await refreshAccessToken(auth))
        return request<T>(path, options, auth, true);
      await clearTokens(auth);
    }
    throw error;
  }
}

const json = (method: string, body?: JsonRecord): RequestInit => ({
  method,
  ...(body ? { body: JSON.stringify(body) } : {}),
});
const id = (value: string) => encodeURIComponent(value);
const parent = <T = ApiResult>(path: string, options?: RequestInit) =>
  request<T>(path, options, "user");
const device = <T = ApiResult>(path: string, options?: RequestInit) =>
  request<T>(path, options, "device");

export const api = {
  health: () => request("health"),
  root: async () => {
    const rootUrl = apiBaseUrl.replace(/\/api$/, "");
    try {
      const response = await fetch(rootUrl);
      return (await response.json()) as ApiResult;
    } catch {
      throw new ApiError(`Could not connect to ${rootUrl}.`, 0);
    }
  },
  auth: {
    register: (body: JsonRecord) =>
      request("auth/register", json("POST", body)),
    login: (body: JsonRecord) => request("auth/login", json("POST", body)),
    verifyMfaLogin: (body: JsonRecord) =>
      request("auth/mfa/verify-login", json("POST", body)),
    refresh: (refreshToken: string) =>
      request("auth/refresh", json("POST", { refreshToken })),
    logout: (refreshToken: string) =>
      request("auth/logout", json("POST", { refreshToken })),
    me: () => parent("auth/me"),
    parentMe: () => parent("auth/parent/me"),
  },
  pairing: {
    generate: (childId: string) =>
      parent("device-pairing/generate", json("POST", { childId })),
    complete: (body: JsonRecord) =>
      request("device-pairing/complete", json("POST", body)),
    heartbeat: () => device("device-heartbeat", json("POST")),
    refresh: (refreshToken: string) =>
      request("device-refresh", json("POST", { refreshToken })),
    logout: (refreshToken: string) =>
      request("device-logout", json("POST", { refreshToken })),
  },
  devices: {
    list: () => parent("devices"),
    get: (deviceId: string) => parent(`devices/${id(deviceId)}`),
    setStatus: (deviceId: string, status: string) =>
      parent(`devices/${id(deviceId)}/status`, json("PATCH", { status })),
    remove: (deviceId: string) =>
      parent(`devices/${id(deviceId)}`, json("DELETE")),
    permissions: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/permissions`),
    updatePermission: (
      deviceId: string,
      permissionId: string,
      allowed: boolean,
    ) =>
      parent(
        `devices/${id(deviceId)}/permissions/${id(permissionId)}`,
        json("PATCH", { allowed }),
      ),
  },
  permissionRequests: {
    create: (body: JsonRecord) =>
      device("device/permission-requests", json("POST", body)),
    mine: () => device("device/my-permission-requests"),
    list: () => parent("device/permission-requests"),
    approve: (requestId: string) =>
      parent(
        `device/permission-requests/${id(requestId)}/approve`,
        json("PATCH"),
      ),
    reject: (requestId: string) =>
      parent(
        `device/permission-requests/${id(requestId)}/reject`,
        json("PATCH"),
      ),
  },
  screenTime: {
    get: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/screen-time-policy`),
    create: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/screen-time-policy`, json("POST", body)),
    update: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/screen-time-policy`, json("PATCH", body)),
    appLimits: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/app-limits`),
    createAppLimit: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/app-limits`, json("POST", body)),
    updateAppLimit: (deviceId: string, limitId: string, body: JsonRecord) =>
      parent(
        `devices/${id(deviceId)}/app-limits/${id(limitId)}`,
        json("PATCH", body),
      ),
    deleteAppLimit: (deviceId: string, limitId: string) =>
      parent(
        `devices/${id(deviceId)}/app-limits/${id(limitId)}`,
        json("DELETE"),
      ),
  },
  usage: {
    record: (body: JsonRecord) =>
      device("device/app-usage", json("POST", body)),
    list: (deviceId: string) => parent(`devices/${id(deviceId)}/app-usage`),
    summary: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/app-usage/summary`),
  },
  activity: {
    record: (body: JsonRecord) => device("device/activity", json("POST", body)),
    list: (deviceId: string) => parent(`devices/${id(deviceId)}/activities`),
    summary: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/activities/summary`),
  },
  commands: {
    create: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/commands`, json("POST", body)),
    pending: () => device("device/commands"),
    updateStatus: (commandId: string, status: string) =>
      device(
        `device/commands/${id(commandId)}/status`,
        json("PATCH", { status }),
      ),
    history: (deviceId: string) => parent(`devices/${id(deviceId)}/commands`),
  },
  dns: {
    get: (deviceId: string) => parent(`devices/${id(deviceId)}/dns-policy`),
    create: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/dns-policy`, json("POST", body)),
    update: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/dns-policy`, json("PATCH", body)),
    rules: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/dns-policy/domain-rules`),
    createRule: (deviceId: string, body: JsonRecord) =>
      parent(
        `devices/${id(deviceId)}/dns-policy/domain-rules`,
        json("POST", body),
      ),
    updateRule: (deviceId: string, ruleId: string, body: JsonRecord) =>
      parent(
        `devices/${id(deviceId)}/dns-policy/domain-rules/${id(ruleId)}`,
        json("PATCH", body),
      ),
    deleteRule: (deviceId: string, ruleId: string) =>
      parent(
        `devices/${id(deviceId)}/dns-policy/domain-rules/${id(ruleId)}`,
        json("DELETE"),
      ),
  },
  categories: {
    list: () => parent("domain-categories"),
    get: (categoryId: string) => parent(`domain-categories/${id(categoryId)}`),
    create: (body: JsonRecord) =>
      parent("domain-categories", json("POST", body)),
    update: (categoryId: string, body: JsonRecord) =>
      parent(`domain-categories/${id(categoryId)}`, json("PATCH", body)),
    delete: (categoryId: string) =>
      parent(`domain-categories/${id(categoryId)}`, json("DELETE")),
  },
  appPolicies: {
    list: (deviceId: string) => parent(`devices/${id(deviceId)}/app-policies`),
    create: (deviceId: string, body: JsonRecord) =>
      parent(`devices/${id(deviceId)}/app-policies`, json("POST", body)),
    update: (deviceId: string, policyId: string, body: JsonRecord) =>
      parent(
        `devices/${id(deviceId)}/app-policies/${id(policyId)}`,
        json("PATCH", body),
      ),
    delete: (deviceId: string, policyId: string) =>
      parent(
        `devices/${id(deviceId)}/app-policies/${id(policyId)}`,
        json("DELETE"),
      ),
  },
  browserHistory: {
    record: (body: JsonRecord) =>
      device("device/browser-history", json("POST", body)),
    list: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/browser-history`),
  },
  alerts: {
    create: (body: JsonRecord) => device("device/alerts", json("POST", body)),
    list: () => parent("alerts"),
    get: (alertId: string) => parent(`alerts/${id(alertId)}`),
    acknowledge: (alertId: string) =>
      parent(`alerts/${id(alertId)}/acknowledge`, json("PATCH")),
  },
  notifications: {
    list: () => parent("notifications"),
    get: (notificationId: string) =>
      parent(`notifications/${id(notificationId)}`),
    markRead: (notificationId: string) =>
      parent(`notifications/${id(notificationId)}/read`, json("PATCH")),
    markAllRead: () => parent("notifications/read-all", json("PATCH")),
  },
  location: {
    current: (deviceId: string) => parent(`devices/${id(deviceId)}/location`),
    history: (deviceId: string) =>
      parent(`devices/${id(deviceId)}/location/history`),
  },
  mfa: {
    setup: () => parent("auth/mfa/setup", json("POST")),
    enable: (token: string) =>
      parent("auth/mfa/enable", json("POST", { token })),
    status: () => parent("auth/mfa/status"),
    disable: (password: string, token: string) =>
      parent("auth/mfa/disable", json("POST", { password, token })),
  },
  auditLogs: (query: Record<string, string | number | undefined> = {}) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      if (value !== undefined) params.set(key, String(value));
    const search = params.toString();
    return parent(`audit-logs${search ? `?${search}` : ""}`);
  },
};
