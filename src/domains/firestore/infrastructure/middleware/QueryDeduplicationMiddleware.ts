/**
 * Query Deduplication Middleware
 * Prevents duplicate Firestore queries within a short time window
 */

import type { QueryKey } from '../../utils/deduplication/query-key-generator.util';
import { generateQueryKey } from '../../utils/deduplication/query-key-generator.util';
import { PendingQueryManager } from '../../utils/deduplication/pending-query-manager.util';
import { TimerManager } from '../../utils/deduplication/timer-manager.util';

const DEDUPLICATION_WINDOW_MS = 1000;
const CLEANUP_INTERVAL_MS = 5000;

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

  async deduplicate<T>(
    queryKey: QueryKey,
    queryFn: () => Promise<T>,
  ): Promise<T> {
    const key = generateQueryKey(queryKey);

    // FIX: Atomic get-or-create pattern to prevent race conditions
    const existingPromise = this.queryManager.get(key);
    if (existingPromise) {
      return existingPromise as Promise<T>;
    }

    // Create promise with cleanup on completion
    const promise = (async () => {
      try {
        return await queryFn();
      } finally {
        // Cleanup after completion (success or error)
        this.queryManager.remove(key);
      }
    })();

    // Add before any await - this prevents race between check and add
    this.queryManager.add(key, promise);

    return promise;
  }

  clear(): void {
    this.queryManager.clear();
  }

  destroy(): void {
    this.timerManager.destroy();
    this.queryManager.clear();
  }

  getPendingCount(): number {
    return this.queryManager.size();
  }
}

export const queryDeduplicationMiddleware = new QueryDeduplicationMiddleware();
