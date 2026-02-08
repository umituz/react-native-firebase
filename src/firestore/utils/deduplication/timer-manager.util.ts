/**
 * Timer Manager Utility
 * Manages cleanup timers for deduplication middleware
 */

export interface TimerManagerOptions {
  cleanupIntervalMs: number;
  onCleanup: () => void;
}

export class TimerManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly options: TimerManagerOptions;

  constructor(options: TimerManagerOptions) {
    this.options = options;
  }

  /**
   * Start the cleanup timer
   */
  start(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      try {
        this.options.onCleanup();
      } catch {
        // Silently handle cleanup errors to prevent timer from causing issues
      }
    }, this.options.cleanupIntervalMs);
  }

  /**
   * Stop the cleanup timer
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.timer !== null;
  }

  /**
   * Destroy the timer manager
   */
  destroy(): void {
    this.stop();
  }
}
