/**
 * Request Logger Service
 * Infrastructure service for logging Firestore requests
 */

import type { RequestLog, RequestStats, RequestType } from '../../domain/entities/RequestLog';
import { generateUUID } from '@umituz/react-native-design-system/uuid';

/**
 * Maximum number of logs to keep in memory
 * Prevents unbounded memory growth
 */
export const DEFAULT_MAX_LOGS = 1000;

export class RequestLoggerService {
  private logs: RequestLog[] = [];
  private readonly maxLogs: number;
  private listeners: Set<(log: RequestLog) => void> = new Set();
  private static readonly LISTENER_ERROR_PREFIX = '[RequestLoggerService] Listener error:';

  constructor(maxLogs: number = DEFAULT_MAX_LOGS) {
    this.maxLogs = maxLogs;
  }

  /**
   * Log a request
   */
  logRequest(log: Omit<RequestLog, 'id' | 'timestamp'>): void {
    const fullLog: RequestLog = {
      ...log,
      id: generateUUID(),
      timestamp: Date.now(),
    };

    this.logs.push(fullLog);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.notifyListeners(fullLog);
  }

  /**
   * Get all logs
   * PERF: Return array directly without copy - logs is private and immutable from outside
   * Callers should not modify the returned array.
   */
  getLogs(): RequestLog[] {
    return this.logs;
  }

  /**
   * Get logs by type
   * Optimized: Return empty array early if no logs
   */
  getLogsByType(type: RequestType): RequestLog[] {
    if (this.logs.length === 0) return [];
    return this.logs.filter((log) => log.type === type);
  }

  /**
   * Get request statistics
   * Optimized: Single-pass calculation O(n) instead of O(7n)
   */
  getStats(): RequestStats {
    let readRequests = 0;
    let writeRequests = 0;
    let deleteRequests = 0;
    let listenerRequests = 0;
    let cachedRequests = 0;
    let failedRequests = 0;
    let durationSum = 0;
    let durationCount = 0;

    // Single pass through logs for all statistics
    for (const log of this.logs) {
      switch (log.type) {
        case 'read':
          readRequests++;
          break;
        case 'write':
          writeRequests++;
          break;
        case 'delete':
          deleteRequests++;
          break;
        case 'listener':
          listenerRequests++;
          break;
      }

      if (log.cached) cachedRequests++;
      if (!log.success) failedRequests++;

      if (log.duration !== undefined) {
        durationSum += log.duration;
        durationCount++;
      }
    }

    return {
      totalRequests: this.logs.length,
      readRequests,
      writeRequests,
      deleteRequests,
      listenerRequests,
      cachedRequests,
      failedRequests,
      averageDuration: durationCount > 0 ? durationSum / durationCount : 0,
    };
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Add log listener
   */
  addListener(listener: (log: RequestLog) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Remove all listeners
   * Prevents memory leaks when service is destroyed
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Destroy service and cleanup resources
   */
  destroy(): void {
    this.removeAllListeners();
    this.clearLogs();
  }

  /**
   * Notify all listeners
   * PERF: Use for...of instead of forEach for better performance
   */
  private notifyListeners(log: RequestLog): void {
    for (const listener of this.listeners) {
      try {
        listener(log);
      } catch (error) {
        // Log listener errors in development to help debugging
        // In production, silently ignore to prevent crashing the app
        if (__DEV__) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn(`${RequestLoggerService.LISTENER_ERROR_PREFIX} ${errorMessage}`);
        }
      }
    }
  }
}

export const requestLoggerService = new RequestLoggerService();

