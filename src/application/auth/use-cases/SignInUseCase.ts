/**
 * Sign In Use Case
 * Single Responsibility: Handle user sign in operations
 *
 * Application use case for user authentication.
 * Coordinates domain services and infrastructure.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from 'firebase/auth';
import type { Result } from '../../../shared/domain/utils';
import type { IAuthPort, EmailCredentials, SignInResult } from '../ports/AuthPort';

/**
 * Sign in use case result
 */
export interface SignInUseCaseResult extends Result<SignInResult> {
  readonly requiresVerification?: boolean;
}

/**
 * Sign in use case options
 */
export interface SignInOptions {
  /** Email credentials */
  readonly email: string;
  /** Password */
  readonly password: string;
  /** Remember user */
  readonly rememberMe?: boolean;
}

/**
 * Sign in use case
 * Handles user sign in with validation and error handling
 */
export class SignInUseCase {
  private readonly authPort: IAuthPort;

  constructor(authPort: IAuthPort) {
    this.authPort = authPort;
  }

  /**
   * Execute sign in use case
   * Validates credentials and signs in user
   */
  async execute(options: SignInOptions): Promise<SignInUseCaseResult> {
    // Validate credentials
    const validation = this.validateCredentials(options);
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'auth/invalid-credentials',
          message: validation.error,
        },
      };
    }

    // Create credentials object
    const credentials: EmailCredentials = {
      email: options.email,
      password: options.password,
    };

    // Sign in with credentials
    const result = await this.authPort.signInWithEmail(credentials);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        requiresVerification: this.requiresVerification(result.error?.code),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  }

  /**
   * Validate email and password
   */
  private validateCredentials(options: SignInOptions): { valid: boolean; error?: string } {
    const { email, password } = options;

    // Validate email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return { valid: false, error: 'Password is required' };
    }

    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }

    return { valid: true };
  }

  /**
   * Check if error requires email verification
   */
  private requiresVerification(errorCode?: string): boolean {
    return errorCode === 'auth/unverified-email' || errorCode === 'auth/email-not-verified';
  }

  /**
   * Check if user is already signed in
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
   * Sign out current user
   */
  async signOut(): Promise<Result<void>> {
    return this.authPort.signOut();
  }

  /**
   * Check if credentials match current user
   */
  async credentialsMatchCurrentUser(email: string): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return false;
    }

    return currentUser.email.toLowerCase() === email.toLowerCase();
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  isStrongPassword(password: string): boolean {
    // Basic password strength check
    return password.length >= 8;
  }

  /**
   * Get password strength indicator
   */
  getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    if (password.length < 6) {
      return 'weak';
    }

    if (password.length < 8) {
      return 'medium';
    }

    // Check for variety
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    const varietyScore = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (varietyScore >= 3) {
      return 'strong';
    }

    return 'medium';
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(errorCode?: string): boolean {
    return errorCode === 'auth/too-many-requests' || errorCode === 'auth/user-disabled';
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/invalid-credentials': 'Invalid email or password',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/unverified-email': 'Please verify your email first',
      'auth/user-disabled': 'This account has been disabled',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/invalid-email': 'Invalid email address',
    };

    return errorMessages[errorCode] || 'Sign in failed. Please try again.';
  }

  /**
   * Create sign in options from email and password
   */
  createOptions(email: string, password: string, rememberMe: boolean = false): SignInOptions {
    return {
      email,
      password,
      rememberMe,
    };
  }

  /**
   * Quick sign in helper
   */
  async quickSignIn(email: string, password: string): Promise<SignInUseCaseResult> {
    return this.execute(this.createOptions(email, password));
  }
}

/**
 * Factory function to create sign in use case
 */
export function createSignInUseCase(authPort: IAuthPort): SignInUseCase {
  return new SignInUseCase(authPort);
}

/**
 * Factory function to create sign in use case with default auth port
 */
export async function createDefaultSignInUseCase(): Promise<SignInUseCase> {
  const { createAuthPort } = await import('../ports/AuthPort');
  const authPort = createAuthPort();
  return createSignInUseCase(authPort);
}
