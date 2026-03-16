/**
 * Pagination Helper
 *
 * Utilities for cursor-based pagination in Firestore.
 * Handles pagination logic, cursor management, and hasMore detection.
 *
 * App-agnostic: Works with any document type and any collection.
 * Optimized: Uses centralized calculation utilities.
 *
 * @example
 * ```typescript
 * import { PaginationHelper } from '@umituz/react-native-firestore';
 *
 * const helper = new PaginationHelper<Post>();
 * const result = helper.buildResult(posts, 10, post => post.id);
 * ```
 */

import type { PaginatedResult, PaginationParams } from '../types/pagination.types';
import {
  safeSlice,
  getFetchLimit as calculateFetchLimit,
  hasMore as checkHasMore,
  getResultCount,
  safeFloor,
} from '../../../shared/domain/utils/calculation.util';

export class PaginationHelper<T> {
  /**
   * Build paginated result from items
   * Optimized: Uses centralized calculation utilities
   *
   * @param items - All items fetched (should be limit + 1)
   * @param pageLimit - Requested page size
   * @param getCursor - Function to extract cursor from item
   * @returns Paginated result with hasMore and nextCursor
   */
  buildResult(
    items: T[],
    pageLimit: number,
    getCursor: (item: T) => string,
  ): PaginatedResult<T> {
    const hasMoreValue = checkHasMore(items.length, pageLimit);
    const resultCount = getResultCount(items.length, pageLimit);
    const resultItems = safeSlice(items, 0, resultCount);

    // Safe access: check array is not empty before accessing last item
    let nextCursor: string | null = null;
    if (hasMoreValue && resultItems.length > 0) {
      const lastItem = resultItems[resultItems.length - 1];
      if (lastItem) {
        nextCursor = getCursor(lastItem);
      }
    }

    return {
      items: resultItems,
      nextCursor,
      hasMore: hasMoreValue,
    };
  }

  /**
   * Get default limit from params or use default
   * Optimized: Uses centralized calculation utility
   *
   * @param params - Pagination params
   * @param defaultLimit - Default limit if not specified
   * @returns Page limit
   */
  getLimit(params?: PaginationParams, defaultLimit: number = 10): number {
    const limit = params?.limit ?? defaultLimit;
    return safeFloor(limit, 1);
  }

  /**
   * Calculate fetch limit (page limit + 1 for hasMore detection)
   * Optimized: Uses centralized calculation utility
   *
   * @param pageLimit - Requested page size
   * @returns Fetch limit (pageLimit + 1)
   */
  getFetchLimit(pageLimit: number): number {
    return calculateFetchLimit(pageLimit);
  }

  /**
   * Check if params has cursor
   * Inline function for performance
   *
   * @param params - Pagination params
   * @returns true if cursor exists
   */
  hasCursor(params?: PaginationParams): boolean {
    return !!params?.cursor;
  }
}

/**
 * Create pagination helper for a specific type
 * Optimized: Returns a new instance each time (lightweight)
 *
 * @returns PaginationHelper instance
 *
 * @example
 * ```typescript
 * const helper = createPaginationHelper<Post>();
 * const result = helper.buildResult(posts, 10, post => post.id);
 * ```
 */
export function createPaginationHelper<T>(): PaginationHelper<T> {
  return new PaginationHelper<T>();
}
