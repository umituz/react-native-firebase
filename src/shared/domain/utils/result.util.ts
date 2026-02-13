/**
 * Result Utility
 * Re-exports all result utilities for backward compatibility
 * @deprecated Import from specific result files instead
 */

// Types
export type {
  ErrorInfo,
  Result,
  SuccessResult,
  FailureResult,
} from './result/result-types';

// Creators
export {
  successResult,
  failureResult,
  failureResultFrom,
  failureResultFromError,
} from './result/result-creators';

// Helpers
export {
  isSuccess,
  isFailure,
  getDataOrDefault,
  mapResult,
  chainResults,
} from './result/result-helpers';
