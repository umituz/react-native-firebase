/**
 * Base Auth Service
 *
 * Provides common authentication service functionality
 */

/**
 * Check if error is a cancellation error
 */
export function isCancellationError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('ERR_CANCELED');
  }
  return false;
}
