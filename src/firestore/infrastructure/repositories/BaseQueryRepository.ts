/**
 * Base Repository - Query Operations
 *
 * Provides query and tracking operations for Firestore repositories.
 * Extends BaseRepository with query-specific functionality.
 */

import type { Query } from "firebase/firestore";
import { quotaTrackingMiddleware } from "../middleware/QuotaTrackingMiddleware";
import { queryDeduplicationMiddleware } from "../middleware/QueryDeduplicationMiddleware";
import { BaseRepository } from "./BaseRepository";

export abstract class BaseQueryRepository extends BaseRepository {
  /**
   * Execute query with deduplication and quota tracking
   * Prevents duplicate queries and tracks quota usage
   *
   * @param collection - Collection name
   * @param query - Firestore query (kept for interface compatibility)
   * @param queryFn - Function to execute the query
   * @param cached - Whether the result is from cache
   * @param uniqueKey - Unique key for deduplication (critical for correct caching)
   * @returns Query result
   */
  protected async executeQuery<T>(
    collection: string,
    _query: Query,
    queryFn: () => Promise<T>,
    cached: boolean = false,
    uniqueKey?: string
  ): Promise<T> {
    // FIX: query.toString() returns "[object Object]" which breaks deduplication
    // We must rely on the caller providing a uniqueKey or fallback to a collection-based key (less efficient but safe)
    const safeKey = uniqueKey || `${collection}_generic_query_${Date.now()}`;

    const queryKey = {
      collection,
      filters: safeKey, // Use the unique key as the filter identifier
      limit: undefined,
      orderBy: undefined,
    };

    return queryDeduplicationMiddleware.deduplicate(queryKey, async () => {
      // Execute the query function
      const result = await queryFn();
      
      // Track the operation after successful execution
      // We calculate count based on result if possible, otherwise default to 1 (for list/count queries)
      const count = Array.isArray(result) ? result.length : 1;
      
      this.trackRead(collection, count, cached);
      
      return result;
    });
  }

  /**
   * Track read operation
   *
   * @param collection - Collection name
   * @param count - Number of documents read
   * @param cached - Whether the result is from cache
   */
  protected trackRead(
    collection: string,
    count: number = 1,
    cached: boolean = false,
  ): void {
    quotaTrackingMiddleware.trackRead(collection, count, cached);
  }

  protected trackWrite(
    collection: string,
    count: number = 1,
  ): void {
    quotaTrackingMiddleware.trackWrite(collection, count);
  }

  protected trackDelete(
    collection: string,
    count: number = 1,
  ): void {
    quotaTrackingMiddleware.trackDelete(collection, count);
  }
}