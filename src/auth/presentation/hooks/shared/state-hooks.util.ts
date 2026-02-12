/**
 * State Management Hooks
 * React hooks for managing component state with loading and error handling
 */

import { useState, useCallback, useRef } from 'react';

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
