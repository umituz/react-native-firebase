/**
 * useFirebaseAuth Hook
 * React hook for raw Firebase Auth state
 *
 * NOTE: For comprehensive auth management (user types, guest mode, sign in/out),
 * use useAuth from @umituz/react-native-auth package instead.
 * This hook provides minimal Firebase Auth access.
 */

import { useEffect } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import { useFirebaseAuthStore } from "../../infrastructure/stores/auth.store";

export interface UseFirebaseAuthResult {
  /** Current Firebase user */
  user: User | null;
  /** Whether auth state is loading */
  loading: boolean;
  /** Whether Firebase Auth is initialized */
  initialized: boolean;
}

/**
 * Hook for raw Firebase Auth state
 *
 * Uses shared store to ensure only one listener is active.
 */
export function useFirebaseAuth(): UseFirebaseAuthResult {
  const { user, loading, initialized, setupListener } = useFirebaseAuthStore();

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return;
    }

    setupListener(auth);

    // Cleanup function - called when component unmounts
    return () => {
      // Note: We don't call cleanupListener here because the store manages
      // the shared listener. Multiple components can use this hook simultaneously,
      // and we want to keep the listener active until all components are unmounted.
      // The store will handle cleanup when appropriate.
    };
  }, [setupListener]); // setupListener is stable from the store

  return {
    user,
    loading,
    initialized,
  };
}
