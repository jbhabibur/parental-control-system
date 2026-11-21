/**
 * ============================================================================
 * Real-Time Socket.IO Server Configuration
 * ============================================================================
 * Handles real-time bidirectional sync between:
 *  - Parent App  -> room: `parent:<parentUserId>`
 *  - Child App   -> room: `child:<deviceId>`
 *
 * Key events emitted:
 *  - To Parent:
 *      • `permission:requested` -> Child requested access to a website/resource
 *      • `domain:blocked`       -> Child attempted to visit a blocked/prohibited site
 *      • `alert:new`            -> New security alert generated
 *      • `browser:activity`     -> Child visited an allowed website
 *  - To Child:
 *      • `permission:resolved`  -> Parent approved or denied a pending request
 *      • `dns:policy-updated`   -> Parent updated DNS settings or domain rules
 */

import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import env from "./dotenv.js";

let ioInstance = null;

/**
 * Checks whether an HTTP origin is allowed for CORS in Socket.IO.
 * Allows mobile clients (no origin header), configured CLIENT_ORIGINS,
 * and localhost/127.0.0.1 ports during local development.
 */
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (env.CLIENT_ORIGINS.includes(origin)) return true;
  if (
    env.NODE_ENV !== "production" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/i.test(
      origin,
    )
  ) {
    return true;
  }
  return false;
};

/**
 * Initializes Socket.IO on the shared HTTP server with JWT room authentication.
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Origin not allowed"));
      },
      credentials: true,
    },
  });

  // Authenticate incoming socket connections using JWT token
  io.use((socket, next) => {
    try {
      const authToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

      if (!authToken) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(authToken, env.JWT_SECRET);
      socket.user = {
        id: decoded.sub,
        role: decoded.role,
        deviceId: decoded.deviceId || null,
      };
      return next();
    } catch {
      return next(new Error("Invalid or expired socket token"));
    }
  });

  io.on("connection", (socket) => {
    const { id, role, deviceId } = socket.user || {};

    // Place user/device in its dedicated private room
    if (role === "PARENT" && id) {
      socket.join(`parent:${id}`);
      console.log(`[Socket] Parent connected: ${id} (${socket.id})`);
    } else if (role === "CHILD" && deviceId) {
      socket.join(`child:${deviceId}`);
      console.log(`[Socket] Child device connected: ${deviceId} (${socket.id})`);
    } else {
      console.log(`[Socket] Client connected: ${socket.id}`);
    }

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
    });
  });

  ioInstance = io;
  return io;
};

/**
 * Returns the active Socket.IO server instance (or null if not initialized).
 */
export const getIO = () => ioInstance;

/**
 * Emits a real-time event to a specific Parent user's room.
 */
export const emitToParent = (parentId, event, payload) => {
  if (!ioInstance || !parentId) return;
  ioInstance.to(`parent:${parentId}`).emit(event, payload);
};

/**
 * Emits a real-time event to a specific Child device's room.
 */
export const emitToChild = (deviceId, event, payload) => {
  if (!ioInstance || !deviceId) return;
  ioInstance.to(`child:${deviceId}`).emit(event, payload);
};

export default initializeSocket;
