/**
 * Auth Guard Utilities
 * Reusable helpers for auth initialization checks and error handling
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
type AuthGuardResult =
  | { success: true; auth: Auth }
  | FailureResult;

/**
 * Guard that ensures auth is initialized before proceeding
 * Returns auth instance or failure result
 */
function requireAuth(): AuthGuardResult {
  const auth = getFirebaseAuth();
  if (!auth) {
    return failureResultFrom('auth/not-ready', ERROR_MESSAGES.AUTH.NOT_INITIALIZED);
  }
  return { success: true, auth };
}

/**
 * Execute auth operation with automatic auth initialization check and error handling
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
