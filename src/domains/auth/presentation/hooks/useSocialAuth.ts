/**
 * useSocialAuth Hook
 * Provides Google and Apple Sign-In functionality
 */

import { useState, useCallback, useEffect, useMemo } from "react";
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

  // Stabilize config objects to prevent unnecessary re-renders and effect re-runs
  const googleConfig = useMemo(() => config?.google, [
    config?.google?.webClientId,
    config?.google?.iosClientId,
    config?.google?.androidClientId,
  ]);
  const appleEnabled = useMemo(() => config?.apple?.enabled, [config?.apple?.enabled]);

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
    let cancelled = false;

    const checkApple = async () => {
      const available = await appleAuthService.isAvailable();
      if (!cancelled) {
        setAppleAvailable(available && (appleEnabled ?? false));
      }
    };

    checkApple();

    return () => {
      cancelled = true;
    };
  }, [appleEnabled]);

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
