/**
 * useGoogleOAuth Hook
 * Handles Google OAuth flow using expo-auth-session and Firebase auth
 *
 * This hook delegates business logic to GoogleOAuthHookService.
 * Focuses only on React state management and side effects.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getFirebaseAuth } from '../../infrastructure/config/FirebaseAuthClient';
import type { GoogleOAuthConfig } from '../../infrastructure/services/google-oauth.service';
import {
  GoogleOAuthHookService,
  createGoogleOAuthHookService,
  isExpoAuthSessionAvailable,
} from './GoogleOAuthHookService';

export interface UseGoogleOAuthResult {
  signInWithGoogle: () => Promise<SocialAuthResult>;
  googleLoading: boolean;
  googleConfigured: boolean;
  googleAvailable: boolean;
  googleError: string | null;
}

interface SocialAuthResult {
  success: boolean;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Hook for Google OAuth authentication
 * Requires expo-auth-session and expo-web-browser to be installed
 */
export function useGoogleOAuth(config?: GoogleOAuthConfig): UseGoogleOAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Initialize service with config
  const service = useMemo(() => createGoogleOAuthHookService(config), [config]);

  // Update service when config changes
  useEffect(() => {
    service.updateConfig(config);
  }, [service, config]);

  // Memoize service checks
  const googleAvailable = useMemo(() => service.isAvailable(), [service]);
  const googleConfigured = useMemo(() => service.isConfigured(), [service]);

  // Get auth request tuple from service
  const [, response] = service.getAuthRequest();

  // Handle OAuth response
  useEffect(() => {
    if (!googleAvailable || !response) return;

    const handleResponse = async () => {
      setIsLoading(true);
      setGoogleError(null);

      try {
        const auth = getFirebaseAuth();
        await service.handleResponse(response, auth);
      } catch (error) {
        setGoogleError(service.getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    handleResponse().catch((err) => {
      if (__DEV__) {
        console.error('[useGoogleOAuth] Unexpected error in handleResponse:', err);
      }
    });
  }, [response, googleAvailable, service]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    setIsLoading(true);
    setGoogleError(null);

    try {
      const auth = getFirebaseAuth();
      return await service.signIn(auth);
    } catch (error) {
      const errorMessage = service.getErrorMessage(error);
      setGoogleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  return {
    signInWithGoogle,
    googleLoading: isLoading,
    googleConfigured,
    googleAvailable,
    googleError,
  };
}

/**
 * Check if expo-auth-session is available
 * Useful for conditional rendering
 */
export { isExpoAuthSessionAvailable };

