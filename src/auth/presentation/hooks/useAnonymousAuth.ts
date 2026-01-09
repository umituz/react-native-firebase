/**
 * useAnonymousAuth Hook
 * React hook for anonymous authentication state
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import type { AuthCheckResult } from "../../infrastructure/services/auth-utils.service";
import { anonymousAuthService, type AnonymousAuthResult } from "../../infrastructure/services/anonymous-auth.service";
import { createAuthStateChangeHandler, userToAuthCheckResult } from "./utils/auth-state-change.handler";

declare const __DEV__: boolean;

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
        if (__DEV__) {
           
          console.log("[useAnonymousAuth] onAuthStateChanged fired", {
            hasUser: !!user,
            uid: user?.uid,
            isAnonymous: user?.isAnonymous,
            email: user?.email,
          });
        }
        handleAuthStateChange(user);
      });
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Auth listener setup failed');
      setError(authError);
      setLoading(false);
      if (__DEV__) {
         
        console.error("[useAnonymousAuth] Auth listener setup error", authError);
      }
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

    try {
      const result = await anonymousAuthService.signInAnonymously(auth);
      handleAuthStateChange(result.user);

      if (__DEV__) {
         
        console.log("[useAnonymousAuth] Successfully signed in anonymously", {
          uid: result.anonymousUser.uid,
          wasAlreadySignedIn: result.wasAlreadySignedIn,
        });
      }

      return result;
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Anonymous sign in failed');
      setError(authError);
      if (__DEV__) {
         
        console.error("[useAnonymousAuth] Sign in error", authError);
      }
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
