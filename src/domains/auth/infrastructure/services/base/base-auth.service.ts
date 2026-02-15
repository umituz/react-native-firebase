/**
 * Base Auth Service
 *
 * Provides common authentication service functionality
 * Handles error processing, result formatting, and credential management
 */

import type { UserCredential } from 'firebase/auth';
import { toErrorInfo, type Result } from '../../../../../shared/domain/utils';

/**
 * Authentication result with user credential
 */
export interface AuthSuccessData {
  readonly userCredential: UserCredential;
  readonly isNewUser: boolean;
}

/**
 * Auth result type that extends the base Result
 */
export type AuthResult = Result<AuthSuccessData>;

/**
 * Check if user is new based on metadata
 */
export function checkIsNewUser(userCredential: UserCredential): boolean {
  return (
    userCredential.user.metadata.creationTime ===
    userCredential.user.metadata.lastSignInTime
  );
}

/**
 * Check if error is a cancellation error
 */
export function isCancellationError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('ERR_CANCELED');
  }
  return false;
}

/**
 * Create failure result from error
 */
export function createFailureResult(error: unknown): { success: false; error: { code: string; message: string } } {
  const errorInfo = toErrorInfo(error, 'auth/failed');
  return {
    success: false,
    error: errorInfo,
  };
}

/**
 * Create success result from user credential
 */
export function createSuccessResult(userCredential: UserCredential): { success: true; userCredential: UserCredential; isNewUser: boolean } {
  return {
    success: true,
    userCredential,
    isNewUser: checkIsNewUser(userCredential),
  };
}
