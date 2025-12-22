/**
 * useFirebaseAuth Hook
 * React hook for Firebase Auth state management
 *
 * Directly uses Firebase Auth's built-in state management via onAuthStateChanged
 * Simple, performant, no retry mechanism needed (auth is pre-initialized)
 */

import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";

declare const __DEV__: boolean;

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
 * Auth is pre-initialized in appInitializer, so no retry needed.
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

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      // Auth not available (offline mode or error)
      setLoading(false);
      setUser(null);
      setInitialized(false);
      return;
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

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []); // Empty deps - subscribe once on mount

  return {
    user,
    loading,
    initialized,
  };
}

