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
        try {
            return await operation();
        } finally {
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
        }
    }

    /**
     * Track read operation
     * @param _collection - Collection name (reserved for future per-collection tracking)
     * @param count - Number of documents read
     * @param cached - Whether result was from cache
     */
    trackRead(_collection: string, count: number = 1, cached: boolean = false): void {
        if (!cached) {
            this.readCount += count;
        }
    }

    /**
     * Track write operation
     * @param _collection - Collection name (reserved for future per-collection tracking)
     * @param count - Number of documents written
     */
    trackWrite(_collection: string, count: number = 1): void {
        this.writeCount += count;
    }

    /**
     * Track delete operation
     * @param _collection - Collection name (reserved for future per-collection tracking)
     * @param count - Number of documents deleted
     */
    trackDelete(_collection: string, count: number = 1): void {
        this.deleteCount += count;
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
