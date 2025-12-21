/**
 * useAnonymousAuth Hook
 * React hook for anonymous authentication state
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, type Auth } from "firebase/auth";
import { checkAuthState, type AuthCheckResult } from "../../infrastructure/services/auth-utils.service";
import { anonymousAuthService, type AnonymousAuthResult } from "../../infrastructure/services/anonymous-auth.service";

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
  const [authState, setAuthState] = useState<AuthCheckResult>(() =>
    checkAuthState(auth),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const authRef = useRef(auth);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Update ref when auth changes
  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auth state change handler - accepts user from onAuthStateChanged callback
  const handleAuthStateChange = useCallback((user: import("firebase/auth").User | null) => {
    try {
      // Use the user from the callback, NOT auth.currentUser
      // This ensures we have the correct user from Firebase's persistence
      if (!user) {
        setAuthState({
          isAuthenticated: false,
          isAnonymous: false,
          isGuest: false,
          currentUser: null,
          userId: null,
        });
      } else {
        const anonymous = user.isAnonymous === true;
        setAuthState({
          isAuthenticated: true,
          isAnonymous: anonymous,
          isGuest: anonymous,
          currentUser: user,
          userId: user.uid,
        });
      }
      setError(null);
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Auth state check failed');
      setError(authError);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[useAnonymousAuth] Auth state change error", authError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup auth state listener
  // IMPORTANT: Do NOT call handleAuthStateChange() immediately!
  // Wait for onAuthStateChanged to fire - it will have the correct user from persistence
  useEffect(() => {
    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!auth) {
      setAuthState({
        isAuthenticated: false,
        isAnonymous: false,
        isGuest: false,
        currentUser: null,
        userId: null,
      });
      setLoading(false);
      setError(null);
      return;
    }

    // Keep loading true until onAuthStateChanged fires
    setLoading(true);

    try {
      // Listen to auth state changes - this is the ONLY source of truth
      // The first callback will have the user restored from persistence (or null)
      unsubscribeRef.current = onAuthStateChanged(auth, (user) => {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          // eslint-disable-next-line no-console
          console.log("[useAnonymousAuth] onAuthStateChanged fired", {
            hasUser: !!user,
            uid: user?.uid,
            isAnonymous: user?.isAnonymous,
            email: user?.email,
          });
        }
        // IMPORTANT: Pass the user from the callback, not auth.currentUser!
        handleAuthStateChange(user);
      });
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Auth listener setup failed');
      setError(authError);
      setLoading(false);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
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

      // Update auth state after successful sign in
      // Pass the user from the result, not from auth.currentUser
      handleAuthStateChange(result.user);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[useAnonymousAuth] Successfully signed in anonymously", {
          uid: result.anonymousUser.uid,
          wasAlreadySignedIn: result.wasAlreadySignedIn,
        });
      }

      return result;
    } catch (err) {
      const authError = err instanceof Error ? err : new Error('Anonymous sign in failed');
      setError(authError);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
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
