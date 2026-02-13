/**
 * Quota Calculator Service
 * Domain service for calculating quota usage and status
 */

import type { QuotaMetrics, QuotaLimits, QuotaStatus } from '../entities/QuotaMetrics';
import { FREE_TIER_LIMITS, QUOTA_THRESHOLDS, calculateQuotaUsage } from '../constants/QuotaLimits';

/**
 * Default quota limits (Firebase Spark Plan)
 * Can be overridden via configuration
 */
const DEFAULT_QUOTA_LIMITS: QuotaLimits = {
  dailyReadLimit: FREE_TIER_LIMITS.DAILY_READS,
  dailyWriteLimit: FREE_TIER_LIMITS.DAILY_WRITES,
  dailyDeleteLimit: FREE_TIER_LIMITS.DAILY_DELETES,
};

export class QuotaCalculator {
  /**
   * Calculate quota status from metrics and limits
   */
  static calculateStatus(
    metrics: QuotaMetrics,
    limits: QuotaLimits = DEFAULT_QUOTA_LIMITS,
  ): QuotaStatus {
    const readPercentage = calculateQuotaUsage(metrics.readCount, limits.dailyReadLimit) * 100;
    const writePercentage = calculateQuotaUsage(metrics.writeCount, limits.dailyWriteLimit) * 100;
    const deletePercentage = calculateQuotaUsage(metrics.deleteCount, limits.dailyDeleteLimit) * 100;

    const warningThreshold = QUOTA_THRESHOLDS.WARNING * 100;
    const isNearLimit =
      readPercentage >= warningThreshold ||
      writePercentage >= warningThreshold ||
      deletePercentage >= warningThreshold;

    const isOverLimit =
      readPercentage >= 100 ||
      writePercentage >= 100 ||
      deletePercentage >= 100;

    return {
      metrics,
      limits,
      readPercentage,
      writePercentage,
      deletePercentage,
      isNearLimit,
      isOverLimit,
    };
  }

  /**
   * Get default quota limits
   */
  static getDefaultLimits(): QuotaLimits {
    return { ...DEFAULT_QUOTA_LIMITS };
  }

  /**
   * Check if metrics are within limits
   */
  static isWithinLimits(
    metrics: QuotaMetrics,
    limits: QuotaLimits = DEFAULT_QUOTA_LIMITS,
  ): boolean {
    const status = this.calculateStatus(metrics, limits);
    return !status.isOverLimit;
  }
}

