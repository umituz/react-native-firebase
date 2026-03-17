/**
 * useFirestoreSnapshot
 *
 * Bridges Firestore real-time listeners (onSnapshot) with TanStack Query cache.
 * Sets up a subscription that pushes data into the query cache, giving you
 * the same API shape as useQuery but with real-time updates.
 *
 * @example
 * ```typescript
 * const { data: matches, isLoading } = useFirestoreSnapshot<Match[]>({
 *   queryKey: ["matches", userId],
 *   subscribe: (onData) => {
 *     if (!userId) return () => {};
 *     return onSnapshot(matchesCol(userId), (snap) => {
 *       onData(snap.docs.map(d => d.data() as Match));
 *     });
 *   },
 *   enabled: !!userId,
 *   initialData: [],
 * });
 * ```
 */

import { useEffect, useMemo, useRef } from 'react';
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query';

export interface UseFirestoreSnapshotOptions<TData> {
  /** Unique query key for caching */
  queryKey: QueryKey;
  /** Sets up the onSnapshot listener. Must return the unsubscribe function. */
  subscribe: (onData: (data: TData) => void) => () => void;
  /** Whether the subscription should be active */
  enabled?: boolean;
  /** Initial data before first snapshot arrives */
  initialData?: TData;
}

export function useFirestoreSnapshot<TData>(
  options: UseFirestoreSnapshotOptions<TData>,
): UseQueryResult<TData, Error> {
  const { queryKey, subscribe, enabled = true, initialData } = options;
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const dataPromiseRef = useRef<{ resolve: (value: TData) => void; reject: (error: Error) => void } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stabilize queryKey to prevent unnecessary listener re-subscriptions
  const stableKeyString = JSON.stringify(queryKey);
  const stableQueryKey = useMemo(() => queryKey, [stableKeyString]);

  useEffect(() => {
    if (!enabled) return;

    unsubscribeRef.current = subscribe((data) => {
      queryClient.setQueryData(stableQueryKey, data);
      // Resolve any pending promise from queryFn and clear timeout
      if (dataPromiseRef.current) {
        dataPromiseRef.current.resolve(data);
        dataPromiseRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    });

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      // Reject pending promise on cleanup to prevent memory leaks
      if (dataPromiseRef.current) {
        dataPromiseRef.current.reject(new Error('Snapshot listener cleanup'));
        dataPromiseRef.current = null;
      }
      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [enabled, queryClient, stableQueryKey, subscribe]);

  return useQuery<TData, Error>({
    queryKey,
    // Data comes from the snapshot listener, not from a fetch
    queryFn: () => {
      const cached = queryClient.getQueryData<TData>(queryKey);
      if (cached !== undefined) return cached;
      if (initialData !== undefined) return initialData;

      // Return a promise that resolves when snapshot provides data
      // This prevents hanging promises and memory leaks
      return new Promise<TData>((resolve, reject) => {
        dataPromiseRef.current = { resolve, reject };

        // Timeout to prevent infinite waiting (memory leak protection)
        timeoutRef.current = setTimeout(() => {
          if (dataPromiseRef.current) {
            dataPromiseRef.current = null;
            timeoutRef.current = null;
            if (initialData !== undefined) {
              resolve(initialData);
            } else {
              reject(new Error('Snapshot listener timeout'));
            }
          }
        }, 30000); // 30 second timeout
      });
    },
    enabled,
    initialData,
    // Never refetch — data comes from the real-time listener
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
