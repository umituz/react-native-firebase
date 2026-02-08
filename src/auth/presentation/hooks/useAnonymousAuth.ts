/**
 * useAnonymousAuth Hook
 * React hook for anonymous authentication state
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import type { AuthCheckResult } from "../../infrastructure/services/auth-utils.service";
import { anonymousAuthService, type AnonymousAuthResult } from "../../infrastructure/services/anonymous-auth.service";
import { createAuthStateChangeHandler, userToAuthCheckResult } from "./utils/auth-state-change.handler";

export interface UseAnonymousAuthResult extends AuthCheckResult {
  /**
   * Sign in anonymously
   */
  signInAnonymously: () => Promise<AnonymousAuthResult>;

  /**
   * Loading state
   */
  readonly loading: boolean;

  /**
   * Error state
   */
  readonly error: Error | null;

  /**
   * Clear error
   */
  clearError: () => void;
}

/**
 * Hook for anonymous authentication
 */
export function useAnonymousAuth(auth: Auth | null): UseAnonymousAuthResult {
  const [authState, setAuthState] = useState<AuthCheckResult>({
    isAuthenticated: false,
    isAnonymous: false,
    currentUser: null,
    userId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auth state change handler
  const handleAuthStateChange = useCallback((user: User | null) => {
    const handler = createAuthStateChangeHandler({
      setAuthState,
      setLoading,
      setError,
    });
    handler(user);
  }, [setAuthState, setLoading, setError]);

  // Setup auth state listener
  useEffect(() => {
    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!auth) {
      setAuthState(userToAuthCheckResult(null));
      setLoading(false);
      setError(null);
      return;
    }

    // Keep loading true until onAuthStateChanged fires
    setLoading(true);

    try {
      // Listen to auth state changes
      unsubscribeRef.current = onAuthStateChanged(auth, (user) => {
        handleAuthStateChange(user);
      });
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Auth listener setup failed');
      setError(authError);
      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [auth, handleAuthStateChange]);

  // Sign in anonymously
  const signInAnonymously = useCallback(async (): Promise<AnonymousAuthResult> => {
    if (!auth) {
      const authError = new Error("Firebase Auth not initialized");
      setError(authError);
      throw authError;
    }

    setLoading(true);
    setError(null);

    // Additional validation
    try {
      const result = await anonymousAuthService.signInAnonymously(auth);
      handleAuthStateChange(result.user);

      return result;
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Anonymous sign in failed');
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [auth, handleAuthStateChange]);

  return {
    ...authState,
    signInAnonymously,
    loading,
    error,
    clearError,
  };
}
