/**
 * Auth Guard Service
 * Single Responsibility: Validate authenticated user access
 *
 * SOLID: Single Responsibility - Only handles auth validation
 * Generic implementation for all React Native apps
 */

import {
  getCurrentUserId,
  getCurrentUser,
} from './auth-utils.service';
import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';
import { withAuth, withAuthSync } from '../utils/auth-guard.util';

/**
 * Auth Guard Service
 * Provides authentication validation for protected operations
 */
export class AuthGuardService {
  /**
   * Check if user is authenticated (not guest)
   * @throws Error if user is not authenticated
   */
  async requireAuthenticatedUser(): Promise<string> {
    const result = await withAuth(async (auth) => {
      const userId = getCurrentUserId(auth);
      if (!userId) {
        throw new Error(ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED);
      }

      const currentUser = getCurrentUser(auth);
      if (!currentUser) {
        throw new Error(ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED);
      }

      if (currentUser.isAnonymous) {
        throw new Error(ERROR_MESSAGES.AUTH.NON_ANONYMOUS_ONLY);
      }

      return userId;
    });

    if (!result.success) {
      throw new Error(result.error?.message || 'Authentication failed');
    }

    if (!result.data) {
      throw new Error('No user ID returned');
    }

    return result.data;
  }

  /**
   * Check if user is authenticated (not guest)
   * Returns null if not authenticated instead of throwing
   */
  async getAuthenticatedUserId(): Promise<string | null> {
    try {
      return await this.requireAuthenticatedUser();
    } catch {
      return null;
    }
  }

  /**
   * Check if current user is authenticated (not guest)
   */
  isAuthenticated(): boolean {
    const result = withAuthSync((auth) => {
      const currentUser = getCurrentUser(auth);
      if (!currentUser) {
        return false;
      }

      // User must not be anonymous
      return !currentUser.isAnonymous;
    });

    return result.success && result.data ? result.data : false;
  }

  /**
   * Check if current user is guest (anonymous)
   */
  isGuest(): boolean {
    const result = withAuthSync((auth) => {
      const currentUser = getCurrentUser(auth);
      if (!currentUser) {
        return false;
      }

      return currentUser.isAnonymous;
    });

    return result.success && result.data ? result.data : false;
  }
}

export const authGuardService = new AuthGuardService();
