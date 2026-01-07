/**
 * useSocialAuth Hook
 * Provides Google and Apple Sign-In functionality
 */

import { useState, useCallback, useEffect } from "react";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import {
  googleAuthService,
  type GoogleAuthConfig,
} from "../../infrastructure/services/google-auth.service";
import { appleAuthService } from "../../infrastructure/services/apple-auth.service";

export interface SocialAuthConfig {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

export interface SocialAuthResult {
  success: boolean;
  isNewUser?: boolean;
  error?: string;
}

export interface UseSocialAuthResult {
  signInWithGoogleToken: (idToken: string) => Promise<SocialAuthResult>;
  signInWithApple: () => Promise<SocialAuthResult>;
  googleLoading: boolean;
  appleLoading: boolean;
  googleConfigured: boolean;
  appleAvailable: boolean;
}

/**
 * Common sign-in wrapper
 */
async function signInWrapper(
  signInFn: () => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>
): Promise<SocialAuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, error: "Firebase Auth not initialized" };
  }

  return signInFn();
}

export function useSocialAuth(config?: SocialAuthConfig): UseSocialAuthResult {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const googleConfig = config?.google;
  const googleConfigured = !!(
    googleConfig?.webClientId ||
    googleConfig?.iosClientId ||
    googleConfig?.androidClientId
  );

  useEffect(() => {
    if (googleConfig) {
      googleAuthService.configure(googleConfig);
    }
  }, [googleConfig]);

  useEffect(() => {
    const checkApple = async () => {
      const available = await appleAuthService.isAvailable();
      setAppleAvailable(available && (config?.apple?.enabled ?? false));
    };
    checkApple();
  }, [config?.apple?.enabled]);

  const signInWithGoogleToken = useCallback(
    async (idToken: string): Promise<SocialAuthResult> => {
      if (!googleConfigured) {
        return { success: false, error: "Google Sign-In is not configured" };
      }

      setGoogleLoading(true);
      try {
        return await signInWrapper(() =>
          googleAuthService.signInWithIdToken(getFirebaseAuth()!, idToken)
        );
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Google sign-in failed",
        };
      } finally {
        setGoogleLoading(false);
      }
    },
    [googleConfigured]
  );

  const signInWithApple = useCallback(async (): Promise<SocialAuthResult> => {
    if (!appleAvailable) {
      return { success: false, error: "Apple Sign-In is not available" };
    }

    setAppleLoading(true);
    try {
      return await signInWrapper(() =>
        appleAuthService.signIn(getFirebaseAuth()!)
      );
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
