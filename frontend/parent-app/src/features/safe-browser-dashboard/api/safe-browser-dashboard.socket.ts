/**
 * ============================================================================
 * Feature: Safe Browser Dashboard (Parent App) - Real-Time Socket.IO Client
 * ============================================================================
 * Subscribes the Parent App to real-time events in room `parent:<userId>`:
 *  - `permission:requested` -> Child tried visiting an unapproved website
 *  - `domain:blocked`       -> Child tried visiting a blocked/prohibited site
 *  - `browser:activity`     -> Child visited an approved website
 */

import { io, type Socket } from "socket.io-client";
import { getAccessToken, getSocketBaseUrl } from "../../../lib/api";

interface ParentSocketCallbacks {
  onPermissionRequested?: (payload: {
    resource?: string;
    child?: { name?: string };
    device?: { deviceName?: string };
  }) => void;
  onDomainBlocked?: (payload: {
    domain?: string;
    childName?: string;
    deviceName?: string;
    category?: string;
  }) => void;
  onBrowserActivity?: (payload: {
    domain?: string;
    childName?: string;
  }) => void;
  onConnectionChange?: (connected: boolean) => void;
}

/**
 * Connects authenticated parent socket and returns a cleanup disconnect function.
 */
export async function connectParentBrowserSocket(
  callbacks: ParentSocketCallbacks,
): Promise<() => void> {
  const token = await getAccessToken("user");
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

  socket.on("permission:requested", (payload) => {
    callbacks.onPermissionRequested?.(payload);
  });

  socket.on("domain:blocked", (payload) => {
    callbacks.onDomainBlocked?.(payload);
  });

  socket.on("browser:activity", (payload) => {
    callbacks.onBrowserActivity?.(payload);
  });

  return () => {
    socket.removeAllListeners();
    socket.disconnect();
  };
}
