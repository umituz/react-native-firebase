/**
 * Pending Query Manager Utility
 * Manages pending queries for deduplication
 */

interface PendingQuery {
  promise: Promise<unknown>;
  timestamp: number;
}

export class PendingQueryManager {
  private pendingQueries = new Map<string, PendingQuery>();
  private readonly deduplicationWindowMs: number;

  constructor(deduplicationWindowMs: number = 1000) {
    this.deduplicationWindowMs = deduplicationWindowMs;
  }

  /**
   * Check if query is pending and not expired
   */
  isPending(key: string): boolean {
    const pending = this.pendingQueries.get(key);
    if (!pending) return false;

    const age = Date.now() - pending.timestamp;
    if (age > this.deduplicationWindowMs) {
      this.pendingQueries.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get pending query promise
   */
  get(key: string): Promise<unknown> | null {
    const pending = this.pendingQueries.get(key);
    return pending ? pending.promise : null;
  }

  /**
   * Add query to pending list.
   * Cleanup is handled by the caller's finally block in deduplicate().
   */
  add(key: string, promise: Promise<unknown>): void {
    this.pendingQueries.set(key, {
      promise,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove a specific query from pending list
   */
  remove(key: string): void {
    this.pendingQueries.delete(key);
  }

  /**
   * Clean up expired queries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, query] of this.pendingQueries.entries()) {
      if (now - query.timestamp > this.deduplicationWindowMs) {
        this.pendingQueries.delete(key);
      }
    }
  }

  /**
   * Clear all pending queries
   */
  clear(): void {
    this.pendingQueries.clear();
  }

  /**
   * Get pending queries count
   */
  size(): number {
    return this.pendingQueries.size;
  }

  /**
   * Check if there are any pending queries
   */
  isEmpty(): boolean {
    return this.pendingQueries.size === 0;
  }
}
