/**
 * Auth Guard Utilities
 * Reusable helpers for auth initialization checks and error handling
 * Eliminates duplicate auth guard patterns across services and hooks
 */

import type { Auth } from 'firebase/auth';
import { getFirebaseAuth } from '../config/FirebaseAuthClient';
import {
  failureResultFrom,
  successResult,
  failureResultFromError,
} from '../../../../shared/domain/utils/result/result-creators';
import type { Result, FailureResult } from '../../../../shared/domain/utils/result/result-types';
import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';

/**
 * Result of auth guard check
 */
export type AuthGuardResult =
  | { success: true; auth: Auth }
  | FailureResult;

/**
 * Guard that ensures auth is initialized before proceeding
 * Returns auth instance or failure result
 *
 * @example
 * ```typescript
 * const guardResult = requireAuth();
 * if (!guardResult.success) {
 *   return guardResult;
 * }
 * const auth = guardResult.auth;
 * ```
 */
export function requireAuth(): AuthGuardResult {
  const auth = getFirebaseAuth();
  if (!auth) {
    return failureResultFrom('auth/not-ready', ERROR_MESSAGES.AUTH.NOT_INITIALIZED);
  }
  return { success: true, auth };
}

/**
 * Execute auth operation with automatic auth initialization check and error handling
 * Eliminates need for manual auth guards and try-catch blocks
 *
 * @param operation - Operation that requires auth instance
 * @returns Result with operation data or error
 *
 * @example
 * ```typescript
 * export async function signInWithEmail(email: string, password: string): Promise<Result<User>> {
 *   return withAuth(async (auth) => {
 *     const userCredential = await signInWithEmailAndPassword(auth, email, password);
 *     return userCredential.user;
 *   });
 * }
 * ```
 */
export async function withAuth<T>(
  operation: (auth: Auth) => Promise<T>
): Promise<Result<T>> {
  const guardResult = requireAuth();
  if (!guardResult.success) {
    return guardResult;
  }

  try {
    const data = await operation(guardResult.auth);
    return successResult(data);
  } catch (error) {
    return failureResultFromError(error, 'auth/operation-failed');
  }
}

/**
 * Synchronous version of withAuth for non-async operations
 *
 * @param operation - Synchronous operation that requires auth instance
 * @returns Result with operation data or error
 */
export function withAuthSync<T>(
  operation: (auth: Auth) => T
): Result<T> {
  const guardResult = requireAuth();
  if (!guardResult.success) {
    return guardResult;
  }

  try {
    const data = operation(guardResult.auth);
    return successResult(data);
  } catch (error) {
    return failureResultFromError(error, 'auth/operation-failed');
  }
}
