/**
 * Query Key Generator Utility
 * Generates unique keys for query deduplication
 */

export interface QueryKey {
  collection: string;
  filters: string;
  limit?: number;
  orderBy?: string;
}

/**
 * Escape special characters in query key components
 * Prevents key collisions when filter strings contain separator characters
 * FIX: Escape ALL special characters that could cause issues, not just % and |
 */
function escapeKeyComponent(component: string): string {
  return component
    .replace(/%/g, '%25')
    .replace(/\|/g, '%7C')
    .replace(/\n/g, '%0A')
    .replace(/\r/g, '%0D')
    .replace(/\0/g, '%00')
    .replace(/\//g, '%2F');
}

/**
 * Generate a unique key from query parameters
 * Uses URL encoding to prevent collisions from separator characters
 */
export function generateQueryKey(key: QueryKey): string {
  const parts = [
    escapeKeyComponent(key.collection),
    escapeKeyComponent(key.filters),
    key.limit?.toString() || '',
    escapeKeyComponent(key.orderBy || ''),
  ];
  return parts.join('|');
}

