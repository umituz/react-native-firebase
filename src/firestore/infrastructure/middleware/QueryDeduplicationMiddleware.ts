/**
 * Query Deduplication Middleware
 * Prevents duplicate Firestore queries within a short time window
 */

import type { QueryKey } from '../../utils/deduplication/query-key-generator.util';
import { generateQueryKey } from '../../utils/deduplication/query-key-generator.util';
import { PendingQueryManager } from '../../utils/deduplication/pending-query-manager.util';
import { TimerManager } from '../../utils/deduplication/timer-manager.util';

const DEDUPLICATION_WINDOW_MS = 1000; // 1 second
const CLEANUP_INTERVAL_MS = 5000; // 5 seconds

export class QueryDeduplicationMiddleware {
  private readonly queryManager: PendingQueryManager;
  private readonly timerManager: TimerManager;

  constructor(deduplicationWindowMs: number = DEDUPLICATION_WINDOW_MS) {
    this.queryManager = new PendingQueryManager(deduplicationWindowMs);
    this.timerManager = new TimerManager({
      cleanupIntervalMs: CLEANUP_INTERVAL_MS,
      onCleanup: () => this.queryManager.cleanup(),
    });
    this.timerManager.start();
  }

  /**
   * Deduplicate a query
   */
  async deduplicate<T>(
    queryKey: QueryKey,
    queryFn: () => Promise<T>,
  ): Promise<T> {
    const key = generateQueryKey(queryKey);

    if (this.queryManager.isPending(key)) {
      const pendingPromise = this.queryManager.get(key);
      if (pendingPromise) {
        return pendingPromise as Promise<T>;
      }
    }

    const promise = queryFn();
    this.queryManager.add(key, promise);

    return promise;
  }

  /**
   * Clear all pending queries
   */
  clear(): void {
    this.queryManager.clear();
  }

  /**
   * Destroy middleware and cleanup resources
   */
  destroy(): void {
    this.timerManager.destroy();
    this.queryManager.clear();
  }

  /**
   * Get pending queries count
   */
  getPendingCount(): number {
    return this.queryManager.size();
  }
}

export const queryDeduplicationMiddleware = new QueryDeduplicationMiddleware();

// Re-export types for convenience
export type { QueryKey };

