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
  private destroyed = false;

  constructor(options: TimerManagerOptions) {
    this.options = options;
  }

  /**
   * Start the cleanup timer
   * Idempotent: safe to call multiple times
   */
  start(): void {
    if (this.destroyed) {
      return; // Don't start if destroyed
    }

    // Clear existing timer if running (prevents duplicate timers)
    if (this.timer) {
      this.stop();
    }

    this.timer = setInterval(() => {
      if (this.destroyed) {
        this.stop();
        return;
      }

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

    // In React Native, timers may not run when app is backgrounded
    // Unref the timer to allow the event loop to exit if this is the only active timer
    if (typeof (this.timer as any).unref === 'function') {
      (this.timer as any).unref();
    }
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
    return this.timer !== null && !this.destroyed;
  }

  /**
   * Destroy the timer manager
   * Prevents timer from restarting
   */
  destroy(): void {
    this.destroyed = true;
    this.stop();
  }
}
