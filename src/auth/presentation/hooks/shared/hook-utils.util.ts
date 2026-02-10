/**
 * Shared Hook Utilities
 * Common utilities and patterns for React hooks
 * Reduces code duplication across presentation hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';

/**
 * Hook state management result
 */
export interface HookState<T> {
  value: T;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook state actions
 */
export interface HookStateActions<T> {
  setValue: (value: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Create a stateful hook with loading and error handling
 */
export function useHookState<T>(
  initialValue: T
): [HookState<T>, HookStateActions<T>] {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setLoading(false);
    setError(null);
  }, [initialValue]);

  const state: HookState<T> = { value, loading, error };
  const actions: HookStateActions<T> = {
    setValue,
    setLoading,
    setError,
    clearError,
    reset,
  };

  return [state, actions];
}

/**
 * Hook for managing cleanup callbacks
 */
export function useCleanup(
  cleanupFn: () => void,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    return () => {
      cleanupFn();
    };
  }, deps);
}

/**
 * Hook for managing async operation state
 */
export function useAsyncOperation<T = void>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const operationRef = useRef<Promise<T> | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const promise = operation();
      operationRef.current = promise;
      const result = await promise;
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
      operationRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

/**
 * Hook for debounced value updates
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Hook for tracking mounted state
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

/**
 * Hook for safe state updates (only if mounted)
 */
export function useSafeState<T>(
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const isMounted = useIsMounted();
  const [state, setState] = useState<T>(initialValue);

  const setSafeState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (isMounted()) {
        setState(value);
      }
    },
    [isMounted]
  );

  return [state, setSafeState];
}

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
