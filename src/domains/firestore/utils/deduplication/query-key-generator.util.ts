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
 */
function escapeKeyComponent(component: string): string {
  return component.replace(/%/g, '%25').replace(/\|/g, '%7C');
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

