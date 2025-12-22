/**
 * useFirebaseAuth Hook
 * React hook for Firebase Auth state management
 *
 * Directly uses Firebase Auth's built-in state management via onAuthStateChanged
 * Includes retry mechanism to wait for Firebase initialization
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";

declare const __DEV__: boolean;

/** Retry interval in milliseconds */
const RETRY_INTERVAL_MS = 100;
/** Maximum retry attempts (100ms * 50 = 5 seconds max wait) */
const MAX_RETRY_ATTEMPTS = 50;

export interface UseFirebaseAuthResult {
  /** Current authenticated user from Firebase Auth */
  user: User | null;
  /** Whether auth state is loading (initial check) */
  loading: boolean;
  /** Whether Firebase Auth is initialized */
  initialized: boolean;
}

/**
 * Hook for Firebase Auth state management
 *
 * Directly uses Firebase Auth's built-in state management.
 * Includes retry mechanism to wait for Firebase initialization.
 *
 * @example
 * ```typescript
 * const { user, loading } = useFirebaseAuth();
 * ```
 */
export function useFirebaseAuth(): UseFirebaseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const retryCountRef = useRef(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const subscribeToAuth = useCallback(() => {
    try {
      const auth = getFirebaseAuth();

      if (!auth) {
        return false;
      }

      // Subscribe to auth state changes
      unsubscribeRef.current = onAuthStateChanged(auth, (currentUser: User | null) => {
        if (__DEV__) {
          console.log('[useFirebaseAuth] Auth state changed:', currentUser?.uid || 'null');
        }
        setUser(currentUser);
        setLoading(false);
        setInitialized(true);
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Try to subscribe immediately - getFirebaseAuth() will auto-initialize
    const auth = getFirebaseAuth();
    if (auth) {
      if (__DEV__) {
        console.log('[useFirebaseAuth] Firebase Auth available, subscribing...');
      }
      setInitialized(true);
      subscribeToAuth();
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }

    // Firebase not ready, start polling with getFirebaseAuth() which auto-initializes
    if (__DEV__) {
      console.log('[useFirebaseAuth] Firebase Auth not available, starting retry...');
    }

    retryIntervalRef.current = setInterval(() => {
      retryCountRef.current += 1;

      // getFirebaseAuth() will auto-initialize if Firebase App is available
      const authInstance = getFirebaseAuth();
      if (authInstance) {
        // Firebase Auth is now available, subscribe and stop polling
        if (__DEV__) {
          console.log('[useFirebaseAuth] Firebase Auth available after', retryCountRef.current, 'retries');
        }

        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }

        setInitialized(true);
        subscribeToAuth();
        return;
      }

      if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
        // Max retries reached, stop polling
        if (__DEV__) {
          console.log('[useFirebaseAuth] Max retries reached, Firebase Auth not available');
        }

        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }

        setLoading(false);
        setUser(null);
      }
    }, RETRY_INTERVAL_MS);

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [subscribeToAuth]);

  return {
    user,
    loading,
    initialized,
  };
}

