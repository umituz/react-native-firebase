/**
 * useGoogleOAuth Hook
 * Handles Google OAuth flow using expo-auth-session and Firebase auth
 * This hook is optional and requires expo-auth-session to be installed
 */

import { useState, useCallback, useEffect } from "react";
import { googleOAuthService } from "../../infrastructure/services/google-oauth.service";
import { getFirebaseAuth } from "../../infrastructure/config/FirebaseAuthClient";
import type { GoogleOAuthConfig } from "../../infrastructure/services/google-oauth.service";

// Conditional import for expo-auth-session
interface AuthSessionResponse {
  type: string;
  authentication?: { idToken?: string } | null;
}

interface ExpoAuthSessionModule {
  useAuthRequest: (config: {
    iosClientId: string;
    webClientId: string;
    androidClientId: string;
  }) => [unknown, AuthSessionResponse | null, (() => Promise<AuthSessionResponse>) | null];
}

let ExpoAuthSession: ExpoAuthSessionModule | null = null;
let isExpoAuthAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ExpoAuthSession = require("expo-auth-session/providers/google") as ExpoAuthSessionModule;
  isExpoAuthAvailable = true;
} catch {
  // expo-auth-session not available - hook will return unavailable state
}

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

const PLACEHOLDER_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

/**
 * Hook for Google OAuth authentication
 * Requires expo-auth-session and expo-web-browser to be installed
 */
export function useGoogleOAuth(config?: GoogleOAuthConfig): UseGoogleOAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const googleAvailable = googleOAuthService.isAvailable();
  const googleConfigured = googleOAuthService.isConfigured(config);

  // Call the Hook directly (only valid in React component)
  // If expo-auth-session is not available, these will be null
  const [request, response, promptAsync] = isExpoAuthAvailable && ExpoAuthSession
    ? ExpoAuthSession.useAuthRequest({
        iosClientId: config?.iosClientId || PLACEHOLDER_CLIENT_ID,
        webClientId: config?.webClientId || PLACEHOLDER_CLIENT_ID,
        androidClientId: config?.androidClientId || PLACEHOLDER_CLIENT_ID,
      })
    : [null, null, null];

  // Handle OAuth response
  useEffect(() => {
    if (!googleAvailable || !response) return;

    const handleResponse = async () => {
      if (response.type === "success" && response.authentication?.idToken) {
        setIsLoading(true);
        setGoogleError(null);

        try {
          const auth = getFirebaseAuth();
          if (!auth) {
            setGoogleError("Firebase Auth not initialized");
            setIsLoading(false); // FIX: Reset loading state before early return
            return;
          }

          await googleOAuthService.signInWithOAuth(
            auth,
            config,
            async () => response
          );
        } catch (error) {
          setGoogleError(
            error instanceof Error ? error.message : "Firebase sign-in failed"
          );
        } finally {
          setIsLoading(false);
        }
      } else if (response.type === "error") {
        setGoogleError("Google authentication failed");
        setIsLoading(false);
      }
    };

    handleResponse();
  }, [response, googleAvailable, config]);

  const signInWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    if (!googleAvailable) {
      const error = "expo-auth-session is not available. Please install expo-auth-session and expo-web-browser.";
      setGoogleError(error);
      return { success: false, error };
    }

    if (!googleConfigured) {
      const error = "Google Sign-In is not configured. Please provide valid client IDs.";
      setGoogleError(error);
      return { success: false, error };
    }

    if (!request || !promptAsync) {
      const error = "Google Sign-In not ready";
      setGoogleError(error);
      return { success: false, error };
    }

    setIsLoading(true);
    setGoogleError(null);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        const error = "Firebase Auth not initialized";
        setGoogleError(error);
        return { success: false, error };
      }

      return await googleOAuthService.signInWithOAuth(auth, config, promptAsync);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed";
      setGoogleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [googleAvailable, googleConfigured, request, promptAsync, config]);

  return {
    signInWithGoogle,
    googleLoading: isLoading,
    googleConfigured,
    googleAvailable,
    googleError,
  };
}
