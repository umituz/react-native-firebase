/**
 * Password Service
 * Handles password management operations
 */

import { updatePassword, type User } from 'firebase/auth';
import { executeAuthOperation, type Result } from '../../../../shared/domain/utils';

/**
 * Update the current user's password
 * Note: Requires recent authentication. Re-authenticate before calling if needed.
 */
export async function updateUserPassword(user: User, newPassword: string): Promise<Result<void>> {
  return executeAuthOperation(async () => {
    await updatePassword(user, newPassword);
  });
}
