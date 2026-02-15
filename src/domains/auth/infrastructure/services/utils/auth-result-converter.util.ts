/**
 * Auth Result Converter Utilities
 * Shared utilities for converting Result types to service-specific result types
 * Eliminates duplicate result conversion logic in OAuth providers (Apple, Google)
 */

import { isSuccess } from '../../../../../shared/domain/utils/result/result-helpers';
import type { Result } from '../../../../../shared/domain/utils/result/result-types';

/**
 * Generic OAuth authentication success result
 * Used by Apple, Google, and other OAuth providers
 */
export interface OAuthAuthSuccessResult {
  success: true;
  userCredential: any;
  isNewUser: boolean;
}

/**
 * Generic OAuth authentication error result
 */
export interface OAuthAuthErrorResult {
  success: false;
  error: string;
  code?: string;
}

/**
 * Generic OAuth authentication result (discriminated union)
 */
export type OAuthAuthResult = OAuthAuthSuccessResult | OAuthAuthErrorResult;

/**
 * Convert standard Result to OAuth-specific result format
 * Eliminates duplicate conversion logic in Apple and Google auth services
 *
 * @param result - Standard Result from executeAuthOperation
 * @param defaultErrorMessage - Default error message for the specific OAuth provider
 * @returns OAuth-specific result with userCredential and isNewUser
 *
 * @example
 * ```typescript
 * // In AppleAuthService
 * private convertToAppleAuthResult(result: Result<{ userCredential: any; isNewUser: boolean }>): AppleAuthResult {
 *   return convertToOAuthResult(result, "Apple sign-in failed");
 * }
 *
 * // In GoogleAuthService
 * private convertToGoogleAuthResult(result: Result<{ userCredential: any; isNewUser: boolean }>): GoogleAuthResult {
 *   return convertToOAuthResult(result, "Google sign-in failed");
 * }
 * ```
 */
export function convertToOAuthResult(
  result: Result<{ userCredential: any; isNewUser: boolean }>,
  defaultErrorMessage: string = 'Authentication failed'
): OAuthAuthResult {
  if (isSuccess(result) && result.data) {
    return {
      success: true,
      userCredential: result.data.userCredential,
      isNewUser: result.data.isNewUser,
    } as OAuthAuthSuccessResult;
  }
  return {
    success: false,
    error: result.error?.message ?? defaultErrorMessage,
    code: result.error?.code,
  } as OAuthAuthErrorResult;
}
