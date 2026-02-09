/**
 * Base Auth Service
 *
 * Provides common authentication service functionality
 * Handles error processing, result formatting, and credential management
 */

import type { UserCredential } from 'firebase/auth';
import { toAuthErrorInfo } from '../../../../domain/utils/error-handler.util';

/**
 * Base authentication result interface
 */
export interface BaseAuthResult {
  readonly success: boolean;
  readonly error?: string;
  readonly code?: string;
}

/**
 * Successful authentication result
 */
export interface AuthSuccessResult extends BaseAuthResult {
  readonly success: true;
  readonly userCredential: UserCredential;
  readonly isNewUser: boolean;
}

/**
 * Failed authentication result
 */
export interface AuthFailureResult extends BaseAuthResult {
  readonly success: false;
  readonly error: string;
  readonly code: string;
}

/**
 * Combined auth result type
 */
export type AuthResult = AuthSuccessResult | AuthFailureResult;

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
 * Extract error information from unknown error
 */
export function extractAuthError(error: unknown): { code: string; message: string } {
  const errorInfo = toAuthErrorInfo(error);
  return {
    code: errorInfo.code,
    message: errorInfo.message,
  };
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
export function createFailureResult(error: unknown): AuthFailureResult {
  const { code, message } = extractAuthError(error);
  return {
    success: false,
    error: message,
    code,
  };
}

/**
 * Create success result from user credential
 */
export function createSuccessResult(userCredential: UserCredential): AuthSuccessResult {
  return {
    success: true,
    userCredential,
    isNewUser: checkIsNewUser(userCredential),
  };
}

/**
 * Log auth error in development mode
 */
export function logAuthError(serviceName: string, error: unknown): void {
  if (__DEV__) {
    console.error(`[Firebase Auth] ${serviceName} failed:`, error);
  }
}
