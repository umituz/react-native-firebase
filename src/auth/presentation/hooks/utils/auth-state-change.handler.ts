/**
 * Auth State Change Handler
 * Single Responsibility: Handle authentication state changes
 */

import type { User } from 'firebase/auth';
import type { AuthCheckResult } from '../../../infrastructure/services/auth-utils.service';

declare const __DEV__: boolean;

/**
 * Convert Firebase User to AuthCheckResult
 * @param user - Firebase user or null
 * @returns AuthCheckResult
 */
export function userToAuthCheckResult(user: User | null): AuthCheckResult {
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
    isAnonymous: user.isAnonymous === true,
    currentUser: user,
    userId: user.uid,
  };
}

/**
 * Create auth state change handler callback
 * Returns a function that can be used with onAuthStateChanged
 *
 * @param setAuthState - State setter for auth state
 * @param setLoading - State setter for loading
 * @param setError - State setter for errors
 * @returns Callback function for auth state changes
 */
export type AuthStateChangeHandler = (user: User | null) => void;

export interface CreateAuthStateChangeHandlerParams {
  setAuthState: (state: AuthCheckResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export function createAuthStateChangeHandler(
  params: CreateAuthStateChangeHandlerParams
): AuthStateChangeHandler {
  const { setAuthState, setLoading, setError } = params;

  return (user: User | null) => {
    try {
      const authState = userToAuthCheckResult(user);
      setAuthState(authState);
      setError(null);
    } catch (err) {
      const authError =
        err instanceof Error ? err : new Error('Auth state check failed');
      setError(authError);

      if (__DEV__) {
         
        console.error('[AuthStateHandler] Auth state change error', authError);
      }
    } finally {
      setLoading(false);
    }
  };
}
