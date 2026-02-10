/**
 * Result Utility
 * Unified result type for all operations across auth and firestore modules
 * Provides type-safe success/failure handling
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
export type SuccessResult<T = void> = Result<T> & { readonly success: true; readonly data: T; readonly error?: never };

/**
 * Failure result type guard
 */
export type FailureResult = Result & { readonly success: false; readonly data?: never; readonly error: ErrorInfo };

/**
 * Create a success result with optional data
 */
export function successResult<T = void>(data?: T): SuccessResult<T> {
  return { success: true, data: data as T };
}

/**
 * Create a failure result with error information
 */
export function failureResult(error: ErrorInfo): FailureResult {
  return { success: false, error };
}

/**
 * Create a failure result from error code and message
 */
export function failureResultFrom(code: string, message: string): FailureResult {
  return { success: false, error: { code, message } };
}

/**
 * Create a failure result from an unknown error
 */
export function failureResultFromError(error: unknown, defaultCode = 'operation/failed'): FailureResult {
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: (error as { code?: string }).code ?? defaultCode,
        message: error.message,
      },
    };
  }
  return {
    success: false,
    error: {
      code: defaultCode,
      message: typeof error === 'string' ? error : 'Unknown error occurred',
    },
  };
}

/**
 * Check if result is successful
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true && result.error === undefined;
}

/**
 * Check if result is a failure
 */
export function isFailure<T>(result: Result<T>): result is FailureResult {
  return result.success === false;
}

/**
 * Get data from result or return default
 */
export function getDataOrDefault<T>(result: Result<T>, defaultValue: T): T {
  return isSuccess(result) ? (result.data ?? defaultValue) : defaultValue;
}

/**
 * Map success result data to another type
 */
export function mapResult<T, U>(
  result: Result<T>,
  mapper: (data: T) => U
): Result<U> {
  if (isSuccess(result) && result.data !== undefined) {
    return successResult(mapper(result.data));
  }
  // Return a new failure result to avoid type conflicts
  if (isFailure(result)) {
    return { success: false, error: result.error };
  }
  return successResult();
}

/**
 * Chain multiple results, stopping at first failure
 */
export async function chainResults<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<T>> {
  for (const operation of operations) {
    const result = await operation();
    if (isFailure(result)) {
      return result;
    }
  }
  return successResult();
}
