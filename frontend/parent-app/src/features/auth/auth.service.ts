/**
 * ============================================================================
 * Feature: Auth - Service Layer
 * ============================================================================
 * Handles network authentication API operations:
 * 1. Parent registration
 * 2. Parent login (with 2FA challenge support)
 * 3. Two-factor authentication (MFA) challenge verification
 * 4. Token refresh & logout
 */

import { api, JsonRecord } from "../../services/api";

export const authService = {
  /**
   * Registers a new parent administrator.
   */
  register: async (payload: { name: string; email: string; password: string }) => {
    return await api.auth.register(payload);
  },

  /**
   * Performs standard email/password authentication.
   */
  login: async (payload: { email: string; password: string }) => {
    return await api.auth.login(payload);
  },

  /**
   * Verifies the 6-digit TOTP code during a 2FA challenge login.
   */
  verifyMfaLogin: async (payload: { challengeToken: string; code: string }) => {
    return await api.auth.verifyMfaLogin(payload);
  },

  /**
   * Logs out the user and revokes refresh tokens.
   */
  logout: async (refreshToken: string) => {
    return await api.auth.logout(refreshToken);
  },
};
