/**
 * Domain Utils
 * Centralized utilities for domain operations
 */

// Result types and helpers
export type {
  Result,
  SuccessResult,
  FailureResult,
  ErrorInfo,
} from './result/result-types';

export {
  successResult,
  failureResult,
  failureResultFrom,
  failureResultFromError,
} from './result/result-creators';

export {
  isSuccess,
  isFailure,
  getDataOrDefault,
  mapResult,
  chainResults,
} from './result/result-helpers';

// Async operation execution
export {
  executeOperation,
  executeOperationWithCode,
  executeVoidOperation,
  executeAuthOperation,
  executeAll,
  executeSequence,
  executeWithRetry,
  executeWithTimeout,
} from './async-executor.util';

// Service configuration
export {
  ConfigurableService,
  createConfigurableService,
  type ConfigState,
  type IConfigurableService,
} from './service-config.util';

// Credential utilities
export {
  generateGoogleCredential,
  generateAppleCredential,
  isAppleSignInAvailable,
  performAppleSignIn,
  isValidEmailPassword,
  type EmailPasswordCredential,
  type CredentialGenerator,
} from './credential.util';

// Error handling
export { toErrorInfo } from './error-handlers/error-converters';

export {
  hasErrorCode,
  isCancelledError,
  isQuotaErrorInfo,
  isNetworkError,
  isAuthError,
  isQuotaError,
  isRetryableError,
} from './error-handlers/error-checkers';

export {
  ERROR_MESSAGES,
  getQuotaErrorMessage,
  getRetryableErrorMessage,
} from './error-handlers/error-messages';

// Type guards
export {
  hasCodeProperty,
  hasMessageProperty,
  hasCodeAndMessageProperties,
} from './type-guards.util';

// Validation
export {
  isValidString,
  isEmptyString,
  isDefined,
} from './validators/string.validator';

export {
  isValidFirebaseApiKey,
  isValidFirebaseAuthDomain,
  isValidFirebaseProjectId,
} from './validators/firebase.validator';

export {
  isValidUrl,
  isValidHttpsUrl,
} from './validators/url.validator';

export { isValidEmail } from './validators/user-input.validator';

export {
  isNonEmptyArray,
  isInRange,
  isPositive,
  isNonNegative,
} from './validators/generic.validator';

// ID generation
export {
  generateUniqueId,
  generateShortId,
} from './id-generator.util';
