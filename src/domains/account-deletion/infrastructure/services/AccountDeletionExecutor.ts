/**
 * Account Deletion Executor (Main)
 * Single Responsibility: Execute account deletion with retry logic
 *
 * Infrastructure service that executes account deletion operations.
 * Coordinates reauthentication and deletion with error handling.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from 'firebase/auth';
import { getFirebaseAuth } from '../../../auth/infrastructure/config/FirebaseAuthClient';
import { AccountDeletionRepository } from './AccountDeletionRepository';
import { userValidationService } from '../../domain/services/UserValidationService';
import type { Result } from '../../../../shared/domain/utils';
import type { AccountDeletionOptions } from '../../application/ports/reauthentication.types';
import type { AccountDeletionResult } from './AccountDeletionTypes';
import { handleReauthentication } from './AccountDeletionReauthHandler';

/**
 * Account deletion executor
 * Executes account deletion with automatic reauthentication
 */
export class AccountDeletionExecutor {
  private readonly repository: AccountDeletionRepository;
  private deletionInProgress = false;

  constructor(repository?: AccountDeletionRepository) {
    this.repository = repository || new AccountDeletionRepository();
  }

  /**
   * Delete current user account
   * Handles reauthentication automatically if enabled
   */
  async deleteCurrentUser(
    options: AccountDeletionOptions = { autoReauthenticate: true }
  ): Promise<AccountDeletionResult> {
    // Prevent concurrent deletion attempts
    if (this.deletionInProgress) {
      return {
        success: false,
        error: { code: 'auth/operation-in-progress', message: 'Account deletion already in progress' },
        requiresReauth: false,
      };
    }

    this.deletionInProgress = true;

    try {
      const auth = getFirebaseAuth();
      const user = auth?.currentUser;

      if (!auth || !user) {
        return {
          success: false,
          error: { code: 'auth/not-ready', message: 'Auth not ready' },
          requiresReauth: false,
        };
      }

      const originalUserId = user.uid;

      // Validate user for deletion
      const validation = await this.repository.validateForDeletion(user);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error,
          requiresReauth: false,
        };
      }

      const provider = validation.data!.provider;

      // Check if reauthentication is needed
      const needsReauth = this.shouldReauthenticate(user, options, provider);
      if (needsReauth) {
        const reauthResult = await handleReauthentication(user, options, originalUserId, this.repository);
        if (reauthResult) {
          return reauthResult;
        }
      }

      // Attempt deletion
      return await this.performDeletion(user, originalUserId, options);
    } finally {
      this.deletionInProgress = false;
    }
  }

  /**
   * Delete specific user account
   * Direct deletion without reauthentication
   */
  async deleteUserAccount(user: User | null): Promise<AccountDeletionResult> {
    if (!user || user.isAnonymous) {
      return {
        success: false,
        error: { code: 'auth/invalid', message: 'Invalid user' },
        requiresReauth: false,
      };
    }

    try {
      const result = await this.repository.deleteAccount(user);
      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error,
        requiresReauth: result.error?.code === 'auth/requires-recent-login',
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          code: 'auth/failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        requiresReauth: false,
      };
    }
  }

  /**
   * Check if reauthentication is needed
   */
  private shouldReauthenticate(
    user: User,
    options: AccountDeletionOptions,
    provider: string
  ): boolean {
    // Password users need reauthentication
    if (provider === 'password' && options.autoReauthenticate && options.onPasswordRequired) {
      return true;
    }

    // Check if credentials are provided
    const hasCredentials = !!(options.password || options.googleIdToken);
    if (hasCredentials) {
      return true;
    }

    return false;
  }

  /**
   * Perform account deletion
   */
  private async performDeletion(
    user: User,
    originalUserId: string,
    options: AccountDeletionOptions
  ): Promise<AccountDeletionResult> {
    try {
      // Validate user hasn't changed
      const auth = getFirebaseAuth();
      const validation = userValidationService.validateUserUnchanged(auth, originalUserId);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error!,
          requiresReauth: false,
        };
      }

      // Delete account
      const result = await this.repository.deleteAccount(user);
      if (result.success) {
        return { success: true };
      }

      // Check if reauthentication can help
      const error = result.error;
      if (
        error?.code === 'auth/requires-recent-login' &&
        options.autoReauthenticate
      ) {
        const reauthResult = await handleReauthentication(user, options, originalUserId, this.repository);
        if (reauthResult) {
          return reauthResult;
        }
      }

      return {
        success: false,
        error,
        requiresReauth: error?.code === 'auth/requires-recent-login',
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          code: 'auth/failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        requiresReauth: false,
      };
    }
  }

  /**
   * Check if deletion is in progress
   */
  isDeletionInProgress(): boolean {
    return this.deletionInProgress;
  }

  /**
   * Get the repository instance
   */
  getRepository(): AccountDeletionRepository {
    return this.repository;
  }
}

/**
 * Factory function to create account deletion executor
 */
export function createAccountDeletionExecutor(): AccountDeletionExecutor {
  return new AccountDeletionExecutor();
}

/**
 * Default singleton instance
 */
export const accountDeletionExecutor = createAccountDeletionExecutor();
