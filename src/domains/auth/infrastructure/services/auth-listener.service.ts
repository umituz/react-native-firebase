/**
 * Auth Listener Service
 * Manages Firebase auth state listener with timeout protection
 */

import { onIdTokenChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "../config/FirebaseAuthClient";
import type { Result } from "../../../../shared/domain/utils";
import { failureResultFrom, ERROR_MESSAGES } from "../../../../shared/domain/utils";

export interface AuthListenerConfig {
  /**
   * Timeout in milliseconds before marking as initialized
   * @default 10000 (10 seconds)
   */
  timeout?: number;
  /**
   * Callback when auth state changes
   */
  onAuthStateChange?: (user: User | null) => void;
  /**
   * Callback when listener is initialized
   */
  onInitialized?: () => void;
}

export interface AuthListenerResult extends Result<() => void> {
  unsubscribe?: () => void;
}

/**
 * Setup Firebase auth listener with timeout protection
 */
export function setupAuthListener(
  config: AuthListenerConfig = {}
): AuthListenerResult {
  const auth = getFirebaseAuth();
  if (!auth) {
    return failureResultFrom("auth/not-ready", ERROR_MESSAGES.AUTH.NOT_INITIALIZED);
  }

  const {
    timeout = 10000,
    onAuthStateChange,
    onInitialized,
  } = config;

  let hasTriggered = false;
  let unsubscribe: (() => void) | null = null;

  // Safety timeout
  const timeoutId = setTimeout(() => {
    if (!hasTriggered) {
      console.warn(
        "[AuthListener] Auth listener timeout - marking as initialized"
      );
      hasTriggered = true;
      onInitialized?.();
    }
  }, timeout);

  try {
    unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!hasTriggered) {
        hasTriggered = true;
        clearTimeout(timeoutId);
        onInitialized?.();
      }
      onAuthStateChange?.(user);
    });

    const cleanup = () => {
      clearTimeout(timeoutId);
      unsubscribe?.();
    };

    return {
      success: true,
      data: cleanup,
      unsubscribe: cleanup,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const err = error instanceof Error ? error : new Error(String(error));
    return failureResultFrom(
      "auth/listener-failed",
      err.message
    );
  }
}
