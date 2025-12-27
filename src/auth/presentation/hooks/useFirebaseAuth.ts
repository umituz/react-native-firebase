/**
 * useFirebaseAuth Hook
 * React hook for Firebase Auth state management
 *
 * Uses shared Zustand store to ensure only ONE auth listener exists.
 * This prevents performance issues from multiple subscriptions.
 */

import { useEffect } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import { useAuthStore } from "../../infrastructure/stores/auth.store";

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
 * Uses shared store to ensure only one listener is active.
 * Auth is pre-initialized in appInitializer, so no retry needed.
 *
 * @example
 * ```typescript
 * const { user, loading } = useFirebaseAuth();
 * ```
 */
export function useFirebaseAuth(): UseFirebaseAuthResult {
  const { user, loading, initialized, setupListener } = useAuthStore();

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return;
    }

    // Setup listener (will only run once due to store check)
    setupListener(auth);
  }, [setupListener]);

  return {
    user,
    loading,
    initialized,
  };
}
