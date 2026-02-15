/**
 * Domain Utils
 * Centralized utilities for domain operations
 */

// Result types
export {
  successResult,
  failureResult,
  failureResultFrom,
  failureResultFromError,
  isSuccess,
  isFailure,
  getDataOrDefault,
  mapResult,
  chainResults,
  type Result,
  type SuccessResult,
  type FailureResult,
  type ErrorInfo,
} from './result.util';

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
  authErrorConverter,
  defaultErrorConverter,
  type ErrorConverter,
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
export {
  toErrorInfo,
  toAuthErrorInfo,
  hasErrorCode,
  isCancelledError,
  isQuotaErrorInfo,
  isNetworkError,
  isAuthError,
  isQuotaError,
  isRetryableError,
  getQuotaErrorMessage,
  getRetryableErrorMessage,
  type ErrorInfo as ErrorHandlerErrorInfo,
} from './error-handler.util';

// Error messages
export {
  ERROR_MESSAGES,
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
  isValidFirebaseApiKey,
  isValidFirebaseAuthDomain,
  isValidFirebaseProjectId,
  isValidUrl,
  isValidHttpsUrl,
  isValidEmail,
  isDefined,
  isNonEmptyArray,
  isInRange,
  isPositive,
  isNonNegative,
} from './validation.util';

// ID generation
export {
  generateUniqueId,
  generateShortId,
} from './id-generator.util';
