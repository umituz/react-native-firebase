/**
 * Firestore Query Key Factory
 *
 * Creates consistent, type-safe query keys for Firestore collections.
 * Keys follow the pattern: [resource, scope, ...args]
 *
 * @example
 * ```typescript
 * const conversationKeys = createFirestoreKeys("conversations");
 *
 * conversationKeys.all()                // ["conversations"]
 * conversationKeys.lists()              // ["conversations", "list"]
 * conversationKeys.list({ status: "active" }) // ["conversations", "list", { status: "active" }]
 * conversationKeys.detail("abc")        // ["conversations", "detail", "abc"]
 * conversationKeys.userScoped("uid123") // ["conversations", "user", "uid123"]
 * ```
 */

export function createFirestoreKeys(resource: string) {
  return {
    all: () => [resource] as const,
    lists: () => [resource, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      filters
        ? ([resource, 'list', filters] as const)
        : ([resource, 'list'] as const),
    details: () => [resource, 'detail'] as const,
    detail: (id: string | number) => [resource, 'detail', id] as const,
    userScoped: (userId: string) => [resource, 'user', userId] as const,
    custom: (...args: unknown[]) => [resource, ...args] as const,
  };
}
