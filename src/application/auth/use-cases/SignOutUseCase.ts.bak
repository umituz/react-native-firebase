/**
 * Sign Out Use Case
 * Single Responsibility: Handle user sign out operations
 *
 * Application use case for user sign out.
 * Ensures proper cleanup and state management.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from 'firebase/auth';
import type { Result } from '../../../shared/domain/utils';
import type { IAuthPort } from '../ports/AuthPort';

/**
 * Sign out use case result
 */
export interface SignOutUseCaseResult extends Result<void> {
  readonly wasSignedIn: boolean;
}

/**
 * Sign out use case options
 */
export interface SignOutOptions {
  /** Clear local data */
  readonly clearLocalData?: boolean;
  /** Navigate to sign in screen */
  readonly navigateToSignIn?: boolean;
  /** Show confirmation dialog */
  readonly showConfirmation?: boolean;
}

/**
 * Sign out use case
 * Handles user sign out with proper cleanup
 */
export class SignOutUseCase {
  private readonly authPort: IAuthPort;

  constructor(authPort: IAuthPort) {
    this.authPort = authPort;
  }

  /**
   * Execute sign out use case
   * Signs out user and performs cleanup
   */
  async execute(options: SignOutOptions = {}): Promise<SignOutUseCaseResult> {
    const wasSignedIn = this.authPort.isAuthenticated();

    // Check if user is signed in
    if (!wasSignedIn) {
      return {
        success: true,
        wasSignedIn: false,
      };
    }

    // Sign out from auth
    const result = await this.authPort.signOut();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        wasSignedIn,
      };
    }

    // Perform cleanup
    await this.performCleanup(options);

    return {
      success: true,
      wasSignedIn,
    };
  }

  /**
   * Perform cleanup after sign out
   */
  private async performCleanup(options: SignOutOptions): Promise<void> {
    // Clear local data if requested
    if (options.clearLocalData) {
      await this.clearLocalData();
    }

    // Additional cleanup can be added here
    // For example: clear cache, reset state, etc.
  }

  /**
   * Clear local data
   * Override in subclass for custom cleanup
   */
  protected async clearLocalData(): Promise<void> {
    // Default implementation does nothing
    // Subclass can override for custom cleanup
    if (__DEV__) {
      console.log('[SignOutUseCase] Clearing local data');
    }
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.authPort.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authPort.getCurrentUser();
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.authPort.getCurrentUserId();
  }

  /**
   * Check if user is anonymous
   */
  isAnonymous(): boolean {
    return this.authPort.isAnonymous();
  }

  /**
   * Confirm sign out
   * Useful for showing confirmation dialog
   */
  async confirmSignOut(): Promise<boolean> {
    // Default implementation always returns true
    // Override in subclass to show confirmation dialog
    return true;
  }

  /**
   * Validate can sign out
   * Check if sign out is allowed
   */
  async canSignOut(): Promise<Result<void>> {
    if (!this.isSignedIn()) {
      return {
        success: false,
        error: {
          code: 'auth/not-signed-in',
          message: 'No user is currently signed in',
        },
      };
    }

    // Additional checks can be added here
    // For example: check for unsaved changes, active operations, etc.

    return { success: true };
  }

  /**
   * Sign out with confirmation
   * Shows confirmation dialog before signing out
   */
  async signOutWithConfirmation(): Promise<SignOutUseCaseResult> {
    const confirmed = await this.confirmSignOut();

    if (!confirmed) {
      return {
        success: false,
        error: {
          code: 'auth/sign-out-cancelled',
          message: 'Sign out was cancelled',
        },
        wasSignedIn: this.isSignedIn(),
      };
    }

    return this.execute();
  }

  /**
   * Sign out and navigate
   * Signs out and navigates to sign in screen
   */
  async signOutAndNavigate(): Promise<SignOutUseCaseResult> {
    return this.execute({
      clearLocalData: true,
      navigateToSignIn: true,
    });
  }

  /**
   * Force sign out
   * Signs out even if there are errors
   */
  async forceSignOut(): Promise<void> {
    try {
      await this.execute({
        clearLocalData: true,
      });
    } catch (error) {
      // Ignore errors during force sign out
      if (__DEV__) {
        console.error('[SignOutUseCase] Force sign out error:', error);
      }
    }

    // Ensure local data is cleared
    await this.clearLocalData();
  }

  /**
   * Get sign out statistics
   */
  getSignOutStats(): {
    readonly isSignedIn: boolean;
    readonly isAnonymous: boolean;
    readonly hasUserId: boolean;
  } {
    return {
      isSignedIn: this.isSignedIn(),
      isAnonymous: this.isAnonymous(),
      hasUserId: this.getCurrentUserId() !== null,
    };
  }

  /**
   * Create sign out options
   */
  createOptions(options: Partial<SignOutOptions> = {}): SignOutOptions {
    return {
      clearLocalData: false,
      navigateToSignIn: false,
      showConfirmation: false,
      ...options,
    };
  }

  /**
   * Quick sign out helper
   */
  async quickSignOut(): Promise<SignOutUseCaseResult> {
    return this.execute();
  }

  /**
   * Check if confirmation should be shown
   */
  shouldShowConfirmation(): boolean {
    // Default: show confirmation for authenticated users
    return this.isSignedIn() && !this.isAnonymous();
  }

  /**
   * Get user-friendly sign out message
   */
  getSignOutMessage(): string {
    if (!this.isSignedIn()) {
      return 'You are not signed in';
    }

    if (this.isAnonymous()) {
      return 'Sign out from guest session?';
    }

    return 'Are you sure you want to sign out?';
  }
}

/**
 * Factory function to create sign out use case
 */
export function createSignOutUseCase(authPort: IAuthPort): SignOutUseCase {
  return new SignOutUseCase(authPort);
}

/**
 * Factory function to create sign out use case with default auth port
 */
export async function createDefaultSignOutUseCase(): Promise<SignOutUseCase> {
  const { createAuthPort } = await import('../ports/AuthPort');
  const authPort = createAuthPort();
  return createSignOutUseCase(authPort);
}
