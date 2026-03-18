/**
 * Google OAuth Hook Service
 * Single Responsibility: Handle Google OAuth business logic
 *
 * Service class that manages Google OAuth flow.
 * Separates business logic from React hook concerns.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Auth } from 'firebase/auth';
import { googleOAuthService } from '../../infrastructure/services/google-oauth.service';
import type { GoogleOAuthConfig } from '../../infrastructure/services/google-oauth.service';

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
  ExpoAuthSession = require('expo-auth-session/providers/google') as ExpoAuthSessionModule;
  isExpoAuthAvailable = true;
} catch {
  // expo-auth-session not available
}

/**
 * Google OAuth hook service
 * Manages OAuth flow, response handling, and errors
 */
export class GoogleOAuthHookService {
  private config: GoogleOAuthConfig | undefined;
  private authRequest: [unknown, AuthSessionResponse | null, (() => Promise<AuthSessionResponse>) | null];

  constructor(config?: GoogleOAuthConfig) {
    this.config = config;
    this.authRequest = this.initAuthRequest();
  }

  /**
   * Initialize auth request
   * Uses expo-auth-session if available
   */
  private initAuthRequest(): [unknown, AuthSessionResponse | null, (() => Promise<AuthSessionResponse>) | null] {
    if (!isExpoAuthAvailable || !ExpoAuthSession) {
      return [null, null, null];
    }

    return ExpoAuthSession.useAuthRequest({
      iosClientId: this.config?.iosClientId ?? '',
      webClientId: this.config?.webClientId ?? '',
      androidClientId: this.config?.androidClientId ?? '',
    });
  }

  /**
   * Check if Google OAuth is available
   */
  isAvailable(): boolean {
    return isExpoAuthAvailable;
  }

  /**
   * Check if Google OAuth is configured
   */
  isConfigured(): boolean {
    return googleOAuthService.isConfigured(this.config);
  }

  /**
   * Update configuration
   */
  updateConfig(config: GoogleOAuthConfig | undefined): void {
    this.config = config;
  }

  /**
   * Get auth request tuple
   */
  getAuthRequest(): [unknown, AuthSessionResponse | null, (() => Promise<AuthSessionResponse>) | null] {
    return this.authRequest;
  }

  /**
   * Handle OAuth response
   * Called when expo-auth-session returns a response
   */
  async handleResponse(response: AuthSessionResponse | null, auth: Auth | null): Promise<void> {
    if (!response) return;

    if (response.type === 'success' && response.authentication?.idToken) {
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }

      await googleOAuthService.signInWithOAuth(
        auth,
        this.config,
        async () => response
      );
    } else if (response.type === 'error') {
      throw new Error('Google authentication failed');
    }
  }

  /**
   * Sign in with Google
   * Initiates OAuth flow and returns result
   */
  async signIn(auth: Auth | null): Promise<{ success: boolean; isNewUser?: boolean; error?: string }> {
    if (!this.isAvailable()) {
      const error = 'expo-auth-session is not available. Please install expo-auth-session and expo-web-browser.';
      throw new Error(error);
    }

    if (!this.isConfigured()) {
      const error = 'Google Sign-In is not configured. Please provide valid client IDs.';
      throw new Error(error);
    }

    const [, , promptAsync] = this.authRequest;

    if (!promptAsync) {
      throw new Error('Google Sign-In not ready');
    }

    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    return await googleOAuthService.signInWithOAuth(auth, this.config, promptAsync);
  }

  /**
   * Validate OAuth state
   */
  validate(): { valid: boolean; error?: string } {
    if (!this.isAvailable()) {
      return {
        valid: false,
        error: 'expo-auth-session is not available. Please install expo-auth-session and expo-web-browser.',
      };
    }

    if (!this.isConfigured()) {
      return {
        valid: false,
        error: 'Google Sign-In is not configured. Please provide valid client IDs.',
      };
    }

    return { valid: true };
  }

  /**
   * Get error message from error
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Google sign-in failed';
  }

  /**
   * Check if response is successful
   */
  isSuccessfulResponse(response: AuthSessionResponse | null): boolean {
    return response?.type === 'success' && !!response.authentication?.idToken;
  }

  /**
   * Check if response is error
   */
  isErrorResponse(response: AuthSessionResponse | null): boolean {
    return response?.type === 'error';
  }

  /**
   * Extract ID token from response
   */
  extractIdToken(response: AuthSessionResponse | null): string | null {
    return response?.authentication?.idToken || null;
  }

  /**
   * Create error result
   */
  createErrorResult(error: string): { success: false; error: string } {
    return { success: false, error };
  }

  /**
   * Check if auth request is ready
   */
  isReady(): boolean {
    const [request, , promptAsync] = this.authRequest;
    return request !== null && promptAsync !== null;
  }

  /**
   * Get configuration
   */
  getConfig(): GoogleOAuthConfig | undefined {
    return this.config;
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.config = undefined;
  }
}

/**
 * Factory function to create Google OAuth hook service
 */
export function createGoogleOAuthHookService(config?: GoogleOAuthConfig): GoogleOAuthHookService {
  return new GoogleOAuthHookService(config);
}

/**
 * Check if expo-auth-session is available
 * Useful for conditional rendering
 */
export function isExpoAuthSessionAvailable(): boolean {
  return isExpoAuthAvailable;
}

/**
 * Re-export types for convenience
 */
export type { AuthSessionResponse, ExpoAuthSessionModule };
