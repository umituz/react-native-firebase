/**
 * Auth-Specific Hooks
 * React hooks for Firebase Auth state management
 */

import { useRef, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';

/**
 * Create an auth state handler
 */
export function createAuthStateHandler(
  setState: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void
): (user: User | null) => void {
  return (user: User | null) => {
    try {
      setState(user);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Auth state update failed');
      setError(error);
    } finally {
      setLoading(false);
    }
  };
}

/**
 * Hook for managing auth listener lifecycle
 */
export function useAuthListener(
  auth: Auth | null,
  onAuthStateChange: (user: User | null) => void
): void {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!auth) {
      onAuthStateChange(null);
      return;
    }

    unsubscribeRef.current = onAuthStateChanged(auth, onAuthStateChange);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [auth, onAuthStateChange]);
}
