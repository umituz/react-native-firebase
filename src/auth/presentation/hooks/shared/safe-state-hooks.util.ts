/**
 * Safe State Hooks
 * React hooks for safe state management and mounted state tracking
 */

import { useState, useCallback, useRef, useEffect } from 'react';

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
