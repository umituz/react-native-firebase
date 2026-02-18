/**
 * Domain Utils
 * Centralized utilities for domain operations
 */

// Result types and helpers
export type {
  Result,
} from './result/result-types';

export {
  successResult,
  failureResultFrom,
} from './result/result-creators';

// Async operation execution
export {
  executeOperation,
  executeAuthOperation,
} from './async-executor.util';

// Error handling
export { toErrorInfo } from './error-handlers/error-converters';

export {
  ERROR_MESSAGES,
} from './error-handlers/error-messages';
