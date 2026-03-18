/**
 * useGoogleOAuth Hook
 * Handles Google OAuth flow using expo-auth-session and Firebase auth
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { useState, useCallback } from 'react';
import { getFirebaseAuth } from '../../infrastructure/config/FirebaseAuthClient';
import type { GoogleOAuthConfig } from '../../infrastructure/services/google-oauth.service';
import { GoogleOAuthService } from '../../infrastructure/services/google-oauth.service';

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
 */
export function useGoogleOAuth(config?: GoogleOAuthConfig): UseGoogleOAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const service = new GoogleOAuthService();

  const googleAvailable = service.isAvailable();
  const googleConfigured = service.isConfigured(config);

  const signInWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    setIsLoading(true);
    setGoogleError(null);

    try {
      const auth = getFirebaseAuth();
      const result = await service.signInWithOAuth(auth, config);

      if (!result.success) {
        setGoogleError(result.error || 'Google sign-in failed');
        return { success: false, error: result.error };
      }

      return {
        success: true,
        isNewUser: result.isNewUser,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setGoogleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [service, config]);

  return {
    signInWithGoogle,
    googleLoading: isLoading,
    googleConfigured,
    googleAvailable,
    googleError,
  };
}
