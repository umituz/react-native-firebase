/**
 * Auth State Change Handler
 * Single Responsibility: Handle authentication state changes
 */

import type { User } from 'firebase/auth';
import type { AuthCheckResult } from '../../../infrastructure/services/auth-utils.service';
import { createAuthCheckResult } from '../../../infrastructure/services/auth-utils.service';

/**
 * Create auth state change handler callback
 * Returns a function that can be used with onAuthStateChanged
 *
 * @param setAuthState - State setter for auth state
 * @param setLoading - State setter for loading
 * @param setError - State setter for errors
 * @returns Callback function for auth state changes
 */
type AuthStateChangeHandler = (user: User | null) => void;

interface CreateAuthStateChangeHandlerParams {
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
      const authState = createAuthCheckResult(user);
      setAuthState(authState);
      setError(null);
    } catch (err) {
      const authError =
        err instanceof Error ? err : new Error('Auth state check failed');
      setError(authError);
    } finally {
      setLoading(false);
    }
  };
}

/**
 * Convert Firebase User to AuthCheckResult
 * Re-exports createAuthCheckResult for convenience
 */
export const userToAuthCheckResult = createAuthCheckResult;
