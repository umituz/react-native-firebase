/**
 * useFirestoreMutation
 *
 * TanStack Mutation wrapper for Firestore write operations.
 * Automatically invalidates specified query keys on success.
 *
 * @example
 * ```typescript
 * const { mutateAsync } = useFirestoreMutation({
 *   mutationFn: (vars: { title: string }) =>
 *     ConversationService.create(vars.title),
 *   invalidateKeys: [conversationKeys.lists()],
 * });
 *
 * await mutateAsync({ title: "New Chat" });
 * ```
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
  type QueryKey,
} from '@tanstack/react-query';

export interface UseFirestoreMutationOptions<TData, TVars, TContext = unknown>
  extends Omit<UseMutationOptions<TData, Error, TVars, TContext>, 'onSuccess'> {
  /** Query keys to invalidate after a successful mutation */
  invalidateKeys?: QueryKey[];
  /** Called after mutation succeeds and cache is invalidated */
  onSuccess?: (data: TData, variables: TVars) => void;
}

export function useFirestoreMutation<TData, TVars, TContext = unknown>(
  options: UseFirestoreMutationOptions<TData, TVars, TContext>,
): UseMutationResult<TData, Error, TVars, TContext> {
  const queryClient = useQueryClient();
  const { invalidateKeys, onSuccess, ...rest } = options;

  return useMutation<TData, Error, TVars, TContext>({
    ...rest,
    onSuccess: (data, variables, context) => {
      if (invalidateKeys?.length) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      onSuccess?.(data, variables);
    },
  });
}
