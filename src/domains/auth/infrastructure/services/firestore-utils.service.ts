/**
 * Firestore Utilities
 * Centralized utilities for Firestore operations with anonymous user support
 */

import type { Auth } from "firebase/auth";
import { checkAuthState, verifyUserId } from "./auth-utils.service";

export interface FirestoreQueryOptions {
  readonly skipForGuest?: boolean;
  readonly skipIfNotAuthenticated?: boolean;
  readonly verifyUserId?: boolean;
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
 * Create query result helper
 */
function createResult(
  shouldSkip: boolean,
  authState: ReturnType<typeof checkAuthState>,
  reason?: FirestoreQuerySkipReason
): FirestoreQueryResult {
  return {
    shouldSkip,
    reason,
    userId: authState.userId,
    isAnonymous: authState.isAnonymous,
    isAuthenticated: authState.isAuthenticated,
  };
}

/**
 * Check if Firestore query should be skipped
 */
export function shouldSkipFirestoreQuery(
  auth: Auth | null,
  options: FirestoreQueryOptions = {},
): FirestoreQueryResult {
  const {
    skipForGuest = false,
    skipIfNotAuthenticated = true,
    verifyUserId: shouldVerifyUserId = true,
    userId,
  } = options;

  try {
    if (!auth) {
      // Return a default result when no auth instance is available
      return createResult(true, {
        isAuthenticated: false,
        isAnonymous: false,
        currentUser: null,
        userId: null,
      }, "no_auth");
    }

    const authState = checkAuthState(auth);

    if (!authState.isAuthenticated && skipIfNotAuthenticated) {
      return createResult(true, authState, "not_authenticated");
    }

    if (authState.isAnonymous && skipForGuest) {
      return createResult(true, authState, "is_guest");
    }

    if (shouldVerifyUserId && userId && !verifyUserId(auth, userId)) {
      return createResult(true, authState, "user_id_mismatch");
    }

    return createResult(false, authState);
  } catch {
    // Return a default result on error
    return createResult(true, {
      isAuthenticated: false,
      isAnonymous: false,
      currentUser: null,
      userId: null,
    }, "invalid_options");
  }
}

/**
 * Create safe query options with defaults
 */
export function createFirestoreQueryOptions(
  options: Partial<FirestoreQueryOptions> = {},
): FirestoreQueryOptions {
  return {
    skipForGuest: options.skipForGuest ?? false,
    skipIfNotAuthenticated: options.skipIfNotAuthenticated ?? true,
    verifyUserId: options.verifyUserId ?? true,
    userId: options.userId,
  };
}
