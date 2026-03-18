/**
 * useFirestoreQuery
 *
 * TanStack Query integration for Firestore data fetching.
 * Provides Firestore-aware defaults, retry logic, and error handling.
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useFirestoreQuery({
 *   queryKey: conversationKeys.lists(),
 *   queryFn: () => ConversationService.getAll(),
 *   enabled: !!userId,
 * });
 * ```
 */

import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query';
import { isRetryableError } from '../../../../shared/domain/utils/error-handlers/error-checkers';

const FIRESTORE_DEFAULTS = {
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
  retry: (failureCount: number, error: Error) => {
    if (!isRetryableError(error)) return false;
    return failureCount < 2;
  },
} as const;

export type UseFirestoreQueryOptions<
  TData = unknown,
  TError = Error,
> = Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'retry'> & {
  retry?: UseQueryOptions<TData, TError, TData, QueryKey>['retry'];
};

export function useFirestoreQuery<TData = unknown, TError = Error>(
  options: UseFirestoreQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, QueryKey>({
    staleTime: FIRESTORE_DEFAULTS.staleTime,
    gcTime: FIRESTORE_DEFAULTS.gcTime,
    retry: FIRESTORE_DEFAULTS.retry as UseQueryOptions<TData, TError, TData, QueryKey>['retry'],
    ...options,
  });
}
