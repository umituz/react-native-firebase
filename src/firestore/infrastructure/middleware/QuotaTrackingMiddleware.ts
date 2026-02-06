/**
 * Quota Tracking Middleware
 * Tracks Firestore operations for quota monitoring
 */

interface OperationInfo {
    type: 'read' | 'write' | 'delete';
    collection: string;
    count: number;
    cached: boolean;
}

export class QuotaTrackingMiddleware {
    private readCount = 0;
    private writeCount = 0;
    private deleteCount = 0;

    /**
     * Track a Firestore operation
     */
    async trackOperation<T>(
        info: OperationInfo,
        operation: () => Promise<T>
    ): Promise<T> {
        const result = await operation();

        switch (info.type) {
            case 'read':
                if (!info.cached) {
                    this.readCount += info.count;
                }
                break;
            case 'write':
                this.writeCount += info.count;
                break;
            case 'delete':
                this.deleteCount += info.count;
                break;
        }

        if (__DEV__) {
            console.log(`[QuotaTracking] ${info.type}: ${info.collection} (${info.count})`);
        }

        return result;
    }

    /**
     * Track read operation
     */
    trackRead(collection: string, count: number = 1, cached: boolean = false): void {
        if (!cached) {
            this.readCount += count;
        }
        if (__DEV__) {
            console.log(`[QuotaTracking] read: ${collection} (${count})`);
        }
    }

    /**
     * Track write operation
     */
    trackWrite(collection: string, count: number = 1): void {
        this.writeCount += count;
        if (__DEV__) {
            console.log(`[QuotaTracking] write: ${collection} (${count})`);
        }
    }

    /**
     * Track delete operation
     */
    trackDelete(collection: string, count: number = 1): void {
        this.deleteCount += count;
        if (__DEV__) {
            console.log(`[QuotaTracking] delete: ${collection} (${count})`);
        }
    }

    /**
     * Get current counts
     */
    getCounts(): { reads: number; writes: number; deletes: number } {
        return {
            reads: this.readCount,
            writes: this.writeCount,
            deletes: this.deleteCount,
        };
    }

    /**
     * Reset counts
     */
    reset(): void {
        this.readCount = 0;
        this.writeCount = 0;
        this.deleteCount = 0;
    }
}

export const quotaTrackingMiddleware = new QuotaTrackingMiddleware();
