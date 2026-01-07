/**
 * Auth Utils Service
 * Single Responsibility: Provide utility functions for auth state checking
 *
 * SOLID: Single Responsibility - Only handles auth state utilities
 */

import type { Auth, User } from 'firebase/auth';
import { getFirebaseAuth } from '../config/FirebaseAuthClient';

/**
 * Auth check result interface
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;
  isAnonymous: boolean;
  currentUser: User | null;
  userId: string | null;
}

/**
 * Check authentication state
 * Returns comprehensive auth state information
 * Optimized: Single traversal of auth state
 */
export function checkAuthState(auth: Auth | null): AuthCheckResult {
  if (!auth || !auth.currentUser) {
    return {
      isAuthenticated: false,
      isAnonymous: false,
      currentUser: null,
      userId: null,
    };
  }

  const currentUser = auth.currentUser;
  return {
    isAuthenticated: true,
    isAnonymous: currentUser.isAnonymous === true,
    currentUser,
    userId: currentUser.uid,
  };
}

/**
 * Check if user is authenticated (including anonymous)
 */
export function isAuthenticated(auth: Auth | null): boolean {
  return auth?.currentUser?.uid !== null && auth?.currentUser?.uid !== undefined;
}

/**
 * Check if user is anonymous
 */
export function isAnonymous(auth: Auth | null): boolean {
  return auth?.currentUser?.isAnonymous === true;
}

/**
 * Get current user ID (null if not authenticated)
 */
export function getCurrentUserId(auth: Auth | null): string | null {
  return auth?.currentUser?.uid ?? null;
}

/**
 * Get current user (null if not authenticated)
 */
export function getCurrentUser(auth: Auth | null): User | null {
  return auth?.currentUser ?? null;
}

/**
 * Get current authenticated user ID from global auth instance
 * Convenience function that uses getFirebaseAuth()
 */
export function getCurrentUserIdFromGlobal(): string | null {
  return getCurrentUserId(getFirebaseAuth());
}

/**
 * Get current user from global auth instance
 * Convenience function that uses getFirebaseAuth()
 */
export function getCurrentUserFromGlobal(): User | null {
  return getCurrentUser(getFirebaseAuth());
}

/**
 * Check if current user is authenticated (including anonymous)
 * Convenience function that uses getFirebaseAuth()
 */
export function isCurrentUserAuthenticated(): boolean {
  return isAuthenticated(getFirebaseAuth());
}

/**
 * Check if current user is anonymous
 * Convenience function that uses getFirebaseAuth()
 */
export function isCurrentUserAnonymous(): boolean {
  return isAnonymous(getFirebaseAuth());
}

/**
 * Verify userId matches current authenticated user
 */
export function verifyUserId(auth: Auth | null, userId: string): boolean {
  if (!userId) {
    return false;
  }
  return auth?.currentUser?.uid === userId;
}

/**
 * Check if user exists and is valid
 */
export function isValidUser(user: User | null | undefined): user is User {
  return user?.uid !== undefined && user.uid.length > 0;
}

