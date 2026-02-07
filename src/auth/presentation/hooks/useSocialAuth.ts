/**
 * useSocialAuth Hook
 * Provides Google and Apple Sign-In functionality
 */

import { useState, useCallback, useEffect } from "react";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import { googleAuthService } from "../../infrastructure/services/google-auth.service";
import type { GoogleAuthConfig } from "../../infrastructure/services/google-auth.types";
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
        const auth = getFirebaseAuth();
        if (!auth) return { success: false, error: "Firebase Auth not initialized" };
        return await googleAuthService.signInWithIdToken(auth, idToken);
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
      const auth = getFirebaseAuth();
      if (!auth) return { success: false, error: "Firebase Auth not initialized" };
      return await appleAuthService.signIn(auth);
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
