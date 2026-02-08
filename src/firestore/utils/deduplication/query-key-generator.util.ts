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
 * Generate a unique key from query parameters
 */
export function generateQueryKey(key: QueryKey): string {
  const parts = [
    key.collection,
    key.filters,
    key.limit?.toString() || '',
    key.orderBy || '',
  ];
  return parts.join('|');
}

/**
 * Create a query key object
 */
export function createQueryKey(
  collection: string,
  filters: string,
  limit?: number,
  orderBy?: string
): QueryKey {
  return {
    collection,
    filters,
    limit,
    orderBy,
  };
}
