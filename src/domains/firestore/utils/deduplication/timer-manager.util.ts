/**
 * Timer Manager Utility
 * Manages cleanup timers for deduplication middleware
 */

interface TimerManagerOptions {
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
   * Idempotent: safe to call multiple times
   */
  start(): void {
    // Clear existing timer if running (prevents duplicate timers)
    if (this.timer) {
      this.stop();
    }

    this.timer = setInterval(() => {
      try {
        this.options.onCleanup();
      } catch (error) {
        // Silently handle cleanup errors to prevent timer from causing issues
        // Log error in development for debugging (use __DEV__ for React Native)
        if (__DEV__) {
          console.error('TimerManager cleanup error:', error);
        }
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
