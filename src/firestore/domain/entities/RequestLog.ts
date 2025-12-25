/**
 * Request Log Types
 */

export type RequestType = 'read' | 'write' | 'delete' | 'listener';

export interface RequestLog {
    id: string;
    type: RequestType;
    collection: string;
    documentId?: string;
    cached: boolean;
    success: boolean;
    error?: string;
    duration?: number;
    timestamp: number;
}

export interface RequestStats {
    totalRequests: number;
    readRequests: number;
    writeRequests: number;
    deleteRequests: number;
    listenerRequests: number;
    cachedRequests: number;
    failedRequests: number;
    averageDuration: number;
}
