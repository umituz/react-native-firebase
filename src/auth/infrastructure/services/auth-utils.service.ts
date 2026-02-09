/**
 * Auth Utils Service
 * Utility functions for authentication operations
 */

import type { User, Auth } from 'firebase/auth';
import { getFirebaseAuth } from '../config/FirebaseAuthClient';
import { isValidString } from '../../../domain/utils/validation.util';

export interface AuthCheckResult {
  isAuthenticated: boolean;
  isAnonymous: boolean;
  currentUser: User | null;
  userId: string | null;
}

/**
 * Create auth check result from user
 * Centralized utility for creating AuthCheckResult objects
 */
export function createAuthCheckResult(user: User | null): AuthCheckResult {
  if (!user) {
    return {
      isAuthenticated: false,
      isAnonymous: false,
      currentUser: null,
      userId: null,
    };
  }

  return {
    isAuthenticated: true,
    isAnonymous: user.isAnonymous,
    currentUser: user,
    userId: user.uid,
  };
}

/**
 * Check current authentication state
 */
export function checkAuthState(auth: Auth): AuthCheckResult {
  return createAuthCheckResult(auth.currentUser);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(auth: Auth): boolean {
  return auth.currentUser !== null;
}

/**
 * Check if current user is anonymous
 */
export function isAnonymous(auth: Auth): boolean {
  return auth.currentUser?.isAnonymous ?? false;
}

/**
 * Get current user ID
 */
export function getCurrentUserId(auth: Auth): string | null {
  return auth.currentUser?.uid ?? null;
}

/**
 * Get current user
 */
export function getCurrentUser(auth: Auth): User | null {
  return auth.currentUser;
}

/**
 * Get current user ID from global auth instance
 */
export function getCurrentUserIdFromGlobal(): string | null {
  const auth = getFirebaseAuth();

  if (!auth || !auth.currentUser) {
    return null;
  }

  return auth.currentUser.uid;
}

/**
 * Get current user from global auth instance
 */
export function getCurrentUserFromGlobal(): User | null {
  const auth = getFirebaseAuth();

  if (!auth) {
    return null;
  }

  return auth.currentUser;
}

/**
 * Check if current user is authenticated (from global instance)
 */
export function isCurrentUserAuthenticated(): boolean {
  return getCurrentUserFromGlobal() !== null;
}

/**
 * Check if current user is anonymous (from global instance)
 */
export function isCurrentUserAnonymous(): boolean {
  const user = getCurrentUserFromGlobal();
  return user?.isAnonymous ?? false;
}

/**
 * Verify user ID matches
 */
export function verifyUserId(auth: Auth, userId: string): boolean {
  return auth.currentUser?.uid === userId;
}

/**
 * Check if user is valid
 */
export function isValidUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'uid' in user &&
    isValidString(user.uid)
  );
}
