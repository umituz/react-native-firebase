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
