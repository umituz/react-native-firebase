/**
 * Password Service
 * Handles password management operations
 */

import { updatePassword, type User } from 'firebase/auth';

/**
 * Result of a password update operation
 */
export interface PasswordUpdateResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Update the current user's password
 * Note: Requires recent authentication. Re-authenticate before calling if needed.
 */
export async function updateUserPassword(user: User, newPassword: string): Promise<PasswordUpdateResult> {
  try {
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    return {
      success: false,
      error: {
        code: err.code || 'auth/password-update-failed',
        message: err.message || 'Failed to update password',
      },
    };
  }
}
