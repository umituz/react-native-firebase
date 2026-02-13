/**
 * Error Converters
 * Convert unknown errors to structured ErrorInfo
 */

/**
 * Error converter function type
 * Converts unknown errors to ErrorInfo
 */
export type ErrorConverter = (error: unknown) => { code: string; message: string };

/**
 * Default error converter for auth operations
 */
export function authErrorConverter(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    return {
      code: (error as { code?: string }).code ?? 'auth/failed',
      message: error.message,
    };
  }
  return {
    code: 'auth/failed',
    message: typeof error === 'string' ? error : 'Authentication failed',
  };
}

/**
 * Default error converter for operations
 */
export function defaultErrorConverter(
  error: unknown,
  defaultCode = 'operation/failed'
): { code: string; message: string } {
  if (error instanceof Error) {
    return {
      code: (error as { code?: string }).code ?? defaultCode,
      message: error.message,
    };
  }
  return {
    code: defaultCode,
    message: typeof error === 'string' ? error : 'Operation failed',
  };
}
