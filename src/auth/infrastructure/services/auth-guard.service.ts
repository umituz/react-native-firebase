/**
 * Auth Guard Service
 * Single Responsibility: Validate authenticated user access
 *
 * SOLID: Single Responsibility - Only handles auth validation
 * Generic implementation for all React Native apps
 */

import { getFirebaseAuth } from '../config/FirebaseAuthClient';
import {
  getCurrentUserId,
  getCurrentUser,
} from './auth-utils.service';

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
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    const userId = getCurrentUserId(auth);
    if (!userId) {
      throw new Error('User must be authenticated to perform this action');
    }

    const currentUser = getCurrentUser(auth);
    if (!currentUser) {
      throw new Error('User must be authenticated to perform this action');
    }

    // Check if user is anonymous (guest)
    if (currentUser.isAnonymous) {
      throw new Error('Guest users cannot perform this action');
    }

    return userId;
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
    const auth = getFirebaseAuth();
    if (!auth) {
      return false;
    }

    const currentUser = getCurrentUser(auth);
    if (!currentUser) {
      return false;
    }

    // User must not be anonymous
    return !currentUser.isAnonymous;
  }

  /**
   * Check if current user is guest (anonymous)
   */
  isGuest(): boolean {
    const auth = getFirebaseAuth();
    if (!auth) {
      return false;
    }

    const currentUser = getCurrentUser(auth);
    if (!currentUser) {
      return false;
    }

    return currentUser.isAnonymous;
  }
}

export const authGuardService = new AuthGuardService();

