/**
 * Quota Metrics Types
 */

export interface QuotaMetrics {
    readCount: number;
    writeCount: number;
    deleteCount: number;
    lastResetDate: string;
}

export interface QuotaLimits {
    dailyReadLimit: number;
    dailyWriteLimit: number;
    dailyDeleteLimit: number;
}

export interface QuotaStatus {
    metrics: QuotaMetrics;
    limits: QuotaLimits;
    readPercentage: number;
    writePercentage: number;
    deletePercentage: number;
    isNearLimit: boolean;
    isOverLimit: boolean;
}
