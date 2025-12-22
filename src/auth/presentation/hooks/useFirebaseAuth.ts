/**
 * useFirebaseAuth Hook
 * React hook for Firebase Auth state management
 * 
 * Directly uses Firebase Auth's built-in state management via onAuthStateChanged
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseAuthInitialized } from "../../infrastructure/config/FirebaseAuthClient";

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
 * No additional state management layer needed.
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

  useEffect(() => {
    // Check if Firebase Auth is initialized
    const isInitialized = isFirebaseAuthInitialized();
    setInitialized(isInitialized);

    if (!isInitialized) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      
      if (!auth) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Subscribe to auth state changes
      // onAuthStateChanged fires immediately with current user, then on every change
      const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
        setUser(currentUser);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      // Firebase Auth not initialized or error
      setUser(null);
      setLoading(false);
      return () => {};
    }
  }, []);

  return {
    user,
    loading,
    initialized,
  };
}

