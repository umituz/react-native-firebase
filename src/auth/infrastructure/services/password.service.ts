/**
 * Password Service
 * Handles password management operations
 */

import { updatePassword, type User } from 'firebase/auth';
import { toAuthErrorInfo } from '../../../domain/utils/error-handler.util';

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
    const errorInfo = toAuthErrorInfo(error);
    return {
      success: false,
      error: {
        code: errorInfo.code,
        message: errorInfo.message,
      },
    };
  }
}
