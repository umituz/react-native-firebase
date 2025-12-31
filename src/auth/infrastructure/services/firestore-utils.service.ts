/**
 * Firestore Utilities
 * Centralized utilities for Firestore operations with anonymous user support
 */

import type { Auth } from "firebase/auth";
import { checkAuthState, verifyUserId } from "./auth-utils.service";

declare const __DEV__: boolean;

export interface FirestoreQueryOptions {
  /**
   * Skip query if user is anonymous/guest
   * Default: true (guest users don't have Firestore data)
   */
  readonly skipForGuest?: boolean;

  /**
   * Skip query if user is not authenticated
   * Default: true
   */
  readonly skipIfNotAuthenticated?: boolean;

  /**
   * Verify userId matches current user
   * Default: true
   */
  readonly verifyUserId?: boolean;

  /**
   * User ID to verify (required if verifyUserId is true)
   */
  readonly userId?: string;
}

export type FirestoreQuerySkipReason =
  | "not_authenticated"
  | "is_guest"
  | "user_id_mismatch"
  | "no_auth"
  | "invalid_options";

export interface FirestoreQueryResult {
  readonly shouldSkip: boolean;
  readonly reason?: FirestoreQuerySkipReason;
  readonly userId: string | null;
  readonly isAnonymous: boolean;
  readonly isAuthenticated: boolean;
}

/**
 * Check if Firestore query should be skipped
 * Centralized logic for all Firestore operations
 */
export function shouldSkipFirestoreQuery(
  auth: Auth | null,
  options: FirestoreQueryOptions = {},
): FirestoreQueryResult {
  const {
    skipForGuest = true,
    skipIfNotAuthenticated = true,
    verifyUserId: shouldVerify = true,
    userId,
  } = options;

  try {
    // No auth available
    if (!auth) {
      return {
        shouldSkip: true,
        reason: "no_auth",
        userId: null,
        isAnonymous: false,
        isAuthenticated: false,
      };
    }

    // Check auth state
    const authState = checkAuthState(auth);

    // Not authenticated
    if (!authState.isAuthenticated) {
      if (skipIfNotAuthenticated) {
        return {
          shouldSkip: true,
          reason: "not_authenticated",
          userId: null,
          isAnonymous: false,
          isAuthenticated: false,
        };
      }
    }

    // Anonymous user
    if (authState.isAnonymous) {
      if (skipForGuest) {
        return {
          shouldSkip: true,
          reason: "is_guest",
          userId: authState.userId,
          isAnonymous: true,
          isAuthenticated: false,
        };
      }
    }

    // Verify userId if provided
    if (shouldVerify && userId) {
      if (!verifyUserId(auth, userId)) {
        return {
          shouldSkip: true,
          reason: "user_id_mismatch",
          userId: authState.userId,
          isAnonymous: authState.isAnonymous,
          isAuthenticated: authState.isAuthenticated,
        };
      }
    }

    // Don't skip
    return {
      shouldSkip: false,
      userId: authState.userId,
      isAnonymous: authState.isAnonymous,
      isAuthenticated: authState.isAuthenticated,
    };
  } catch (error) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.error("[FirestoreUtils] Error checking if query should be skipped", error);
    }

    return {
      shouldSkip: true,
      reason: "invalid_options",
      userId: null,
      isAnonymous: false,
      isAuthenticated: false,
    };
  }
}

/**
 * Create safe query options with defaults
 */
export function createFirestoreQueryOptions(
  options: Partial<FirestoreQueryOptions> = {},
): FirestoreQueryOptions {
  return {
    skipForGuest: options.skipForGuest ?? true,
    skipIfNotAuthenticated: options.skipIfNotAuthenticated ?? true,
    verifyUserId: options.verifyUserId ?? true,
    userId: options.userId,
  };
}
