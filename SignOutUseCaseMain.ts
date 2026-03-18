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
