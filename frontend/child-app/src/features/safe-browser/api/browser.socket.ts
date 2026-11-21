/**
 * ============================================================================
 * Feature: Safe Browser (Child App) - Real-Time Socket.IO Client
 * ============================================================================
 * Connects the Child Device to the backend Socket.IO room (`child:<deviceId>`)
 * so that parent approvals, denials, and live website blocks take effect
 * IMMEDIATELY inside the Safe Browser.
 */

import { io, type Socket } from "socket.io-client";
import { getAccessToken, getSocketBaseUrl } from "../../../lib/api";

export interface PermissionResolvedEvent {
  id: string;
  deviceId: string;
  requestType: string;
  resource: string;
  status: "APPROVED" | "DENIED";
  reviewedAt?: string;
}

export interface DnsPolicyUpdatedEvent {
  deviceId: string;
  domain?: string;
  action?: "ALLOW" | "BLOCK" | "REMOVED";
  updatedAt?: string;
}

interface SocketCallbacks {
  onPermissionResolved?: (event: PermissionResolvedEvent) => void;
  onDnsPolicyUpdated?: (event: DnsPolicyUpdatedEvent) => void;
  onConnectionChange?: (connected: boolean) => void;
}

/**
 * Opens an authenticated Socket.IO connection for the paired child device.
 * Returns a cleanup function that disconnects the socket cleanly.
 */
export async function connectBrowserSocket(
  callbacks: SocketCallbacks,
): Promise<() => void> {
  const token = await getAccessToken("device");
  if (!token) {
    callbacks.onConnectionChange?.(false);
    return () => {};
  }

  const socket: Socket = io(getSocketBaseUrl(), {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    callbacks.onConnectionChange?.(true);
  });

  socket.on("disconnect", () => {
    callbacks.onConnectionChange?.(false);
  });

  socket.on("permission:resolved", (payload: PermissionResolvedEvent) => {
    callbacks.onPermissionResolved?.(payload);
  });

  socket.on("dns:policy-updated", (payload: DnsPolicyUpdatedEvent) => {
    callbacks.onDnsPolicyUpdated?.(payload);
  });

  return () => {
    socket.removeAllListeners();
    socket.disconnect();
  };
}
