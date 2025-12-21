/**
 * useSocialAuth Hook
 * Provides Google and Apple Sign-In functionality
 *
 * Note: This hook handles the Firebase authentication part.
 * The OAuth flow (expo-auth-session for Google) should be set up in the consuming app.
 */

import { useState, useCallback, useEffect } from "react";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import {
  googleAuthService,
  type GoogleAuthConfig,
} from "../../infrastructure/services/google-auth.service";
import { appleAuthService } from "../../infrastructure/services/apple-auth.service";

/**
 * Social auth configuration
 */
export interface SocialAuthConfig {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

/**
 * Social auth result
 */
export interface SocialAuthResult {
  success: boolean;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Hook result
 */
export interface UseSocialAuthResult {
  /** Sign in with Google using ID token (call after OAuth flow) */
  signInWithGoogleToken: (idToken: string) => Promise<SocialAuthResult>;
  /** Sign in with Apple (handles full flow) */
  signInWithApple: () => Promise<SocialAuthResult>;
  /** Whether Google is loading */
  googleLoading: boolean;
  /** Whether Apple is loading */
  appleLoading: boolean;
  /** Whether Google is configured */
  googleConfigured: boolean;
  /** Whether Apple is available */
  appleAvailable: boolean;
}

/**
 * Hook for social authentication
 *
 * Usage:
 * 1. For Google: Set up expo-auth-session in your app, get idToken, then call signInWithGoogleToken
 * 2. For Apple: Just call signInWithApple (handles complete flow)
 */
export function useSocialAuth(config?: SocialAuthConfig): UseSocialAuthResult {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  // Configure Google Auth
  const googleConfig = config?.google;
  const googleConfigured = !!(
    googleConfig?.webClientId ||
    googleConfig?.iosClientId ||
    googleConfig?.androidClientId
  );

  // Configure Google service on mount
  useEffect(() => {
    if (googleConfig) {
      googleAuthService.configure(googleConfig);
    }
  }, [googleConfig]);

  // Check Apple availability on mount
  useEffect(() => {
    const checkApple = async () => {
      const available = await appleAuthService.isAvailable();
      setAppleAvailable(available && (config?.apple?.enabled ?? false));
    };
    checkApple();
  }, [config?.apple?.enabled]);

  // Sign in with Google using ID token
  const signInWithGoogleToken = useCallback(
    async (idToken: string): Promise<SocialAuthResult> => {
      if (!googleConfigured) {
        return { success: false, error: "Google Sign-In is not configured" };
      }

      setGoogleLoading(true);
      try {
        const auth = getFirebaseAuth();
        if (!auth) {
          return { success: false, error: "Firebase Auth not initialized" };
        }

        const signInResult = await googleAuthService.signInWithIdToken(
          auth,
          idToken,
        );

        return {
          success: signInResult.success,
          isNewUser: signInResult.isNewUser,
          error: signInResult.error,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Google sign-in failed",
        };
      } finally {
        setGoogleLoading(false);
      }
    },
    [googleConfigured],
  );

  // Sign in with Apple
  const signInWithApple = useCallback(async (): Promise<SocialAuthResult> => {
    if (!appleAvailable) {
      return { success: false, error: "Apple Sign-In is not available" };
    }

    setAppleLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        return { success: false, error: "Firebase Auth not initialized" };
      }

      const result = await appleAuthService.signIn(auth);

      return {
        success: result.success,
        isNewUser: result.isNewUser,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Apple sign-in failed",
      };
    } finally {
      setAppleLoading(false);
    }
  }, [appleAvailable]);

  return {
    signInWithGoogleToken,
    signInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  };
}
