/**
 * Performance Tracker Service
 * 
 * Single Responsibility: Track performance metrics of operations
 */

export class PerformanceTracker {
    private activeTracks = new Map<string, number>();

    /**
     * Start tracking an operation
     */
    start(trackingId: string): void {
        this.activeTracks.set(trackingId, Date.now());
    }

    /**
     * End tracking and return duration
     */
    async end(trackingId: string, params: Record<string, any> = {}): Promise<number> {
        const startTime = this.activeTracks.get(trackingId);
        if (!startTime) return 0;

        const duration = Date.now() - startTime;
        this.activeTracks.delete(trackingId);

        // In a full implementation, this could send to Firebase Performance
        // For now, we just log it or handle it as a custom metric
        if (__DEV__) {
            console.log(`⏱️ [Performance] ${trackingId}: ${duration}ms`, params);
        }

        return duration;
    }

    /**
     * Track a function execution
     */
    async track<T>(trackingId: string, fn: () => Promise<T>): Promise<T> {
        this.start(trackingId);
        try {
            return await fn();
        } finally {
            await this.end(trackingId);
        }
    }
}

export const performanceTracker = new PerformanceTracker();
