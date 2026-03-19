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
  private deduplicationWindowMs: number;

  constructor(deduplicationWindowMs: number = 1000) {
    this.deduplicationWindowMs = deduplicationWindowMs;
  }

  /**
   * Update the deduplication window dynamically
   * Used for quota-aware adaptive deduplication
   */
  setWindow(windowMs: number): void {
    this.deduplicationWindowMs = windowMs;
  }

  /**
   * Get current deduplication window
   */
  getWindow(): number {
    return this.deduplicationWindowMs;
  }

  /**
   * Check if query is pending and not expired
   */
  isPending(key: string): boolean {
    const pending = this.pendingQueries.get(key);
    if (!pending) return false;

    // PERF: Cache Date.now() to avoid multiple calls in hot path
    const now = Date.now();
    const age = now - pending.timestamp;
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
   * Also attaches cleanup handlers to prevent memory leaks.
   */
  add(key: string, promise: Promise<unknown>): void {
    // PERF: Cache timestamp to avoid multiple Date.now() calls
    const now = Date.now();

    // Set first, then attach cleanup handler to prevent race condition
    // where immediately-resolved promise triggers cleanup before set()
    this.pendingQueries.set(key, {
      promise,
      timestamp: now,
    });

    // Attach cleanup handler to ensure query is removed from map
    // even if caller's finally block doesn't execute (e.g., unhandled rejection)
    promise.finally(() => {
      // Immediate cleanup - no delay needed for better performance
      this.pendingQueries.delete(key);
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
   * Uses current deduplication window (may be adjusted dynamically)
   */
  cleanup(): void {
    const now = Date.now();
    const windowMs = this.deduplicationWindowMs; // Capture current window

    for (const [key, query] of this.pendingQueries.entries()) {
      if (now - query.timestamp > windowMs) {
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
