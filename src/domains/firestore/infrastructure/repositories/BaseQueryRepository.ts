/**
 * Base Repository - Query Operations
 *
 * Provides query and tracking operations for Firestore repositories.
 * Extends BaseRepository with query-specific functionality.
 */

import { queryDeduplicationMiddleware } from "../middleware/QueryDeduplicationMiddleware";
import { BaseRepository } from "./BaseRepository";

export abstract class BaseQueryRepository extends BaseRepository {
  /**
   * Execute query with deduplication and quota tracking
   * Prevents duplicate queries and tracks quota usage
   */
  protected async executeQuery<T>(
    collection: string,
    queryFn: () => Promise<T>,
    cached: boolean = false,
    uniqueKey?: string
  ): Promise<T> {
    const safeKey = uniqueKey || `${collection}_query`;

    const queryKey = {
      collection,
      filters: safeKey,
      limit: undefined,
      orderBy: undefined,
    };

    return queryDeduplicationMiddleware.deduplicate(queryKey, async () => {
      const result = await queryFn();
      const count = Array.isArray(result) ? result.length : 1;
      this.trackRead(collection, count, cached);
      return result;
    });
  }
}
