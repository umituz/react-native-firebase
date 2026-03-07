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
 *     return onSnapshot(matchesCol(userId!), (snap) => {
 *       onData(snap.docs.map(d => d.data() as Match));
 *     });
 *   },
 *   enabled: !!userId,
 *   initialData: [],
 * });
 * ```
 */

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!enabled) return;

    unsubscribeRef.current = subscribe((data) => {
      queryClient.setQueryData(queryKey, data);
    });

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, queryClient, ...queryKey]);

  return useQuery<TData, Error>({
    queryKey,
    // Data comes from the snapshot listener, not from a fetch
    queryFn: () => {
      const cached = queryClient.getQueryData<TData>(queryKey);
      if (cached !== undefined) return cached;
      if (initialData !== undefined) return initialData;
      // Return a promise that never resolves — the snapshot will provide data
      return new Promise<TData>(() => {});
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
