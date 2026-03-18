/**
 * Auth Port
 * Single Responsibility: Define authentication contract
 *
 * Port interface for authentication operations.
 * Defines the contract that infrastructure must implement.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User, Auth } from 'firebase/auth';
import type { Result } from '../../../shared/domain/utils';

/**
 * Email credentials
 */
export interface EmailCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Sign in result
 */
export interface SignInResult {
  readonly user: User;
  readonly isNewUser: boolean;
}

/**
 * Sign up result
 */
export interface SignUpResult {
  readonly user: User;
  readonly userId: string;
}

/**
 * Auth port interface
 * Defines contract for authentication operations
 */
export interface IAuthPort {
  /**
   * Sign in with email and password
   */
  signInWithEmail(credentials: EmailCredentials): Promise<Result<SignInResult>>;

  /**
   * Sign up with email and password
   */
  signUpWithEmail(credentials: EmailCredentials): Promise<Result<SignUpResult>>;

  /**
   * Sign out current user
   */
  signOut(): Promise<Result<void>>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null;

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Check if user is anonymous
   */
  isAnonymous(): boolean;

  /**
   * Delete user account
   */
  deleteAccount(): Promise<Result<void>>;

  /**
   * Update user password
   */
  updatePassword(newPassword: string): Promise<Result<void>>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<Result<void>>;

  /**
   * Get auth instance
   */
  getAuth(): Auth | null;
}

/**
 * Auth port options
 */
export interface AuthPortOptions {
  /** Auto-initialize auth on first access */
  autoInitialize?: boolean;
  /** Enable detailed logging */
  enableLogging?: boolean;
}

/**
 * Auth port configuration
 */
export interface AuthPortConfig {
  readonly port: IAuthPort;
  readonly options: AuthPortOptions;
}

/**
 * Create auth port configuration
 */
export function createAuthPortConfig(
  port: IAuthPort,
  options: AuthPortOptions = {}
): AuthPortConfig {
  return {
    port,
    options: {
      autoInitialize: true,
      enableLogging: __DEV__,
      ...options,
    },
  };
}

/**
 * Auth port factory
 * Creates auth port instances
 */
export interface IAuthPortFactory {
  createPort(options?: AuthPortOptions): IAuthPort;
}

/**
 * Default auth port factory
 * Implements factory pattern for auth ports
 */
export class AuthPortFactory implements IAuthPortFactory {
  createPort(options?: AuthPortOptions): IAuthPort {
    // Import and create actual implementation
    const { FirebaseAuthPort } = require('../implementations/FirebaseAuthPort');
    return new FirebaseAuthPort(options);
  }
}

/**
 * Default auth port factory instance
 */
export const authPortFactory = new AuthPortFactory();

/**
 * Create auth port with default factory
 */
export function createAuthPort(options?: AuthPortOptions): IAuthPort {
  return authPortFactory.createPort(options);
}
