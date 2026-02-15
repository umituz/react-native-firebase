/**
 * Generic Validation Utilities
 * Provides reusable validation patterns to eliminate duplication
 */

/**
 * Generic validation utility that throws error if validation fails
 * Eliminates duplicate validate-or-throw patterns across the codebase
 *
 * @param value - Value to validate
 * @param validator - Validation function that returns true if valid
 * @param errorMessage - Error message to throw if validation fails
 * @param ErrorClass - Error class to instantiate (defaults to Error)
 * @throws {ErrorClass} When validation fails
 *
 * @example
 * ```typescript
 * validateOrThrow(
 *   cursor,
 *   isValidCursor,
 *   ERROR_MESSAGES.FIRESTORE.INVALID_CURSOR,
 *   CursorValidationError
 * );
 * ```
 */
export function validateOrThrow<T>(
  value: T,
  validator: (value: T) => boolean,
  errorMessage: string,
  ErrorClass: new (message: string) => Error = Error
): void {
  if (!validator(value)) {
    throw new ErrorClass(errorMessage);
  }
}

/**
 * Validate multiple values, throw on first failure
 * Useful for validating multiple preconditions before an operation
 *
 * @param validations - Array of validation configurations
 * @throws {Error} When any validation fails
 *
 * @example
 * ```typescript
 * validateAllOrThrow([
 *   { value: email, validator: isValidEmail, errorMessage: 'Invalid email' },
 *   { value: password, validator: isValidPassword, errorMessage: 'Invalid password' },
 * ]);
 * ```
 */
export function validateAllOrThrow<T = unknown>(
  validations: Array<{
    value: T;
    validator: (value: T) => boolean;
    errorMessage: string;
    ErrorClass?: new (message: string) => Error;
  }>
): void {
  for (const { value, validator, errorMessage, ErrorClass = Error } of validations) {
    validateOrThrow(value, validator, errorMessage, ErrorClass);
  }
}
