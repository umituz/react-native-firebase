/**
 * Password Service
 * Handles password management operations
 */

import { updatePassword, type User } from 'firebase/auth';
import { executeAuthOperation, type Result, ERROR_MESSAGES } from '../../../../shared/domain/utils';

/**
 * Validate password meets Firebase minimum requirements
 * Firebase requires minimum 6 characters
 */
function validatePassword(password: string): void {
  if (typeof password !== 'string') {
    throw new Error(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
  }
  const trimmed = password.trim();
  if (trimmed.length < 6) {
    throw new Error(ERROR_MESSAGES.AUTH.WEAK_PASSWORD);
  }
}

/**
 * Update the current user's password
 * Note: Requires recent authentication. Re-authenticate before calling if needed.
 */
export async function updateUserPassword(user: User, newPassword: string): Promise<Result<void>> {
  return executeAuthOperation(async () => {
    validatePassword(newPassword);
    await updatePassword(user, newPassword);
  });
}
