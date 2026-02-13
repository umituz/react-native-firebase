/**
 * Result Types
 * Type definitions for Result pattern
 */

/**
 * Standard error information structure
 */
export interface ErrorInfo {
  code: string;
  message: string;
}

/**
 * Standard result type for operations
 * Success contains data, failure contains error info
 */
export interface Result<T = void> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ErrorInfo;
}

/**
 * Success result type guard
 */
export type SuccessResult<T = void> = Result<T> & {
  readonly success: true;
  readonly data: T;
  readonly error?: never;
};

/**
 * Failure result type guard
 */
export type FailureResult = Result & {
  readonly success: false;
  readonly data?: never;
  readonly error: ErrorInfo;
};
