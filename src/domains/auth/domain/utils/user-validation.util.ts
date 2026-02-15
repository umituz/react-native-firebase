/**
 * User Validation Utilities
 * Shared utilities for validating user state during operations
 * Eliminates duplicate user validation patterns in account deletion and reauthentication
 */

import type { Auth } from 'firebase/auth';
import { failureResultFrom } from '../../../../shared/domain/utils/result/result-creators';
import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';
import type { FailureResult } from '../../../../shared/domain/utils/result/result-types';

/**
 * Validate that current user hasn't changed during operation
 * Common pattern in account deletion and reauthentication flows
 *
 * This ensures operations complete on the same user that started them,
 * preventing race conditions where user signs out/in during sensitive operations.
 *
 * @param auth - Firebase Auth instance (can be null)
 * @param originalUserId - User ID captured at operation start
 * @returns Success indicator or failure result if user changed
 *
 * @example
 * ```typescript
 * const originalUserId = auth.currentUser?.uid;
 * if (!originalUserId) {
 *   return failureResultFrom('auth/no-user', 'No user signed in');
 * }
 *
 * // ... perform operation ...
 *
 * const validation = validateUserUnchanged(auth, originalUserId);
 * if (!validation.valid) {
 *   return validation; // Return the failure result
 * }
 * ```
 */
export function validateUserUnchanged(
  auth: Auth | null,
  originalUserId: string
): { valid: true } | FailureResult {
  const currentUserId = auth?.currentUser?.uid;

  if (currentUserId !== originalUserId) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(
        `[validateUserUnchanged] User changed during operation. Original: ${originalUserId}, Current: ${currentUserId || 'none'}`
      );
    }
    return failureResultFrom(
      'auth/user-changed',
      ERROR_MESSAGES.AUTH.USER_CHANGED || 'User changed during operation'
    );
  }

  return { valid: true };
}

/**
 * Capture current user ID for later validation
 * Returns null if no user is signed in
 *
 * @param auth - Firebase Auth instance
 * @returns Current user ID or null
 *
 * @example
 * ```typescript
 * const auth = getFirebaseAuth();
 * const originalUserId = captureUserId(auth);
 * if (!originalUserId) {
 *   return failureResultFrom('auth/no-user', 'No user signed in');
 * }
 * ```
 */
export function captureUserId(auth: Auth | null): string | null {
  return auth?.currentUser?.uid ?? null;
}
