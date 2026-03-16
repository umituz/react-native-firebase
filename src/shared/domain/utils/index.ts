/**
 * Domain Utils
 * Centralized utilities for domain operations
 */

// Result types and helpers
export type {
  Result,
  FailureResult,
} from './result/result-types';

export {
  successResult,
  failureResultFrom,
} from './result/result-creators';

export {
  isSuccess,
  isFailure,
} from './result/result-helpers';

// Async operation execution
export {
  executeOperation,
  executeAuthOperation,
} from './executors/basic-executors.util';

// Error handling
export { toErrorInfo } from './error-handlers/error-converters';

export {
  ERROR_MESSAGES,
} from './error-handlers/error-messages';

// Calculation utilities
export {
  calculatePercentage,
  calculateRemaining,
  safeFloor,
  safeCeil,
  clamp,
  diffMs,
  diffMinutes,
  diffHours,
  diffDays,
  safeSlice,
  getFetchLimit,
  hasMore,
  getResultCount,
  chunkArray,
  sumArray,
  averageArray,
  roundToDecimals,
} from './calculation.util';
