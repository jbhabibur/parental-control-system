/**
 * ============================================================================
 * Services: API Gateway
 * ============================================================================
 * Centralized API client service.
 * Re-exports the API client, errors, and types from src/lib/api.ts.
 * This provides a single point of truth for network calls across features.
 */

export * from "../lib/api";
export { api as default } from "../lib/api";
