/**
 * Google OAuth Service
 * Handles Google OAuth flow using expo-auth-session
 * This service is optional and requires expo-auth-session to be installed
 */

import type { Auth } from "firebase/auth";
import type { GoogleAuthResult } from "./google-auth.types";
import { googleAuthService } from "./google-auth.service";

// Conditional import - expo-web-browser is optional
interface ExpoWebBrowserModule {
  maybeCompleteAuthSession: () => { type: string };
}

let ExpoWebBrowser: ExpoWebBrowserModule | null = null;
let isExpoAuthAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ExpoWebBrowser = require("expo-web-browser") as ExpoWebBrowserModule;
  isExpoAuthAvailable = true;

  ExpoWebBrowser.maybeCompleteAuthSession();
} catch {
  // expo-web-browser not available - this is fine if not using Google OAuth
}

export interface GoogleOAuthConfig {
  iosClientId?: string;
  webClientId?: string;
  androidClientId?: string;
}

const PLACEHOLDER_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

function validateGoogleConfig(config?: GoogleOAuthConfig): boolean {
  if (!config) return false;
  return !!(
    (config.iosClientId && config.iosClientId !== PLACEHOLDER_CLIENT_ID) ||
    (config.webClientId && config.webClientId !== PLACEHOLDER_CLIENT_ID) ||
    (config.androidClientId && config.androidClientId !== PLACEHOLDER_CLIENT_ID)
  );
}

/**
 * Google OAuth Service
 * Provides OAuth flow using expo-auth-session
 */
export class GoogleOAuthService {
  /**
   * Check if expo-auth-session is available
   */
  isAvailable(): boolean {
    return isExpoAuthAvailable;
  }

  /**
   * Check if Google OAuth is configured
   */
  isConfigured(config?: GoogleOAuthConfig): boolean {
    return validateGoogleConfig(config);
  }

  /**
   * Sign in with Google using OAuth flow
   */
  async signInWithOAuth(
    auth: Auth,
    config?: GoogleOAuthConfig,
    promptAsync?: () => Promise<{ type: string; authentication?: { idToken?: string } | null }>
  ): Promise<GoogleAuthResult> {
    if (!isExpoAuthAvailable) {
      return {
        success: false,
        error: "expo-auth-session is not available. Please install expo-auth-session and expo-web-browser.",
        code: "unavailable",
      };
    }

    if (!this.isConfigured(config)) {
      return {
        success: false,
        error: "Google Sign-In is not configured. Please provide valid client IDs.",
        code: "not-configured",
      };
    }

    if (!promptAsync) {
      return {
        success: false,
        error: "Google Sign-In not ready. No promptAsync function provided.",
        code: "not-ready",
      };
    }

    try {
      const result = await promptAsync();

      if (result.type === "success" && result.authentication?.idToken) {
        // Use the existing google auth service to sign in with the token
        return await googleAuthService.signInWithIdToken(
          auth,
          result.authentication.idToken
        );
      }

      if (result.type === "cancel") {
        return {
          success: false,
          error: "Google Sign-In was cancelled",
          code: "cancelled",
        };
      }

      return {
        success: false,
        error: "Google Sign-In failed",
        code: "failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Google sign-in failed",
        code: "error",
      };
    }
  }
}

export const googleOAuthService = new GoogleOAuthService();
