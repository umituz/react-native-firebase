/**
 * Account Deletion Repository
 * Single Responsibility: Handle account deletion persistence
 *
 * Infrastructure repository that manages account deletion operations.
 * Uses ServiceBase for error handling and initialization.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { deleteUser, type User } from 'firebase/auth';
import { ServiceBase } from '../../../../shared/infrastructure/base/ServiceBase';
import type { Result } from '../../../../shared/domain/utils';
import { successResult } from '../../../../shared/domain/utils';
import { markUserDeleted } from '../../../auth/infrastructure/services/user-document.service';

/**
 * Account deletion repository
 * Manages account deletion operations and user document cleanup
 */
export class AccountDeletionRepository extends ServiceBase {
  constructor() {
    super({
      serviceName: 'AccountDeletionRepository',
      autoInitialize: true,
    });
  }

  /**
   * Delete user account from Firebase Auth
   * Marks user document as deleted before account removal
   */
  async deleteAccount(user: User): Promise<Result<void>> {
    return this.execute(async () => {
      this.log('Deleting account', { userId: user.uid });

      // Mark user document as deleted
      const marked = await markUserDeleted(user.uid);
      if (!marked && __DEV__) {
        this.logError('Failed to mark user document as deleted');
      }

      // Delete user account
      await deleteUser(user);

      this.log('Account deleted successfully', { userId: user.uid });
    }, 'account-deletion/delete-failed');
  }

  /**
   * Validate user can be deleted
   * Checks user is not anonymous and has valid provider
   */
  async validateForDeletion(user: User | null): Promise<Result<{ userId: string; provider: string }>> {
    return this.executeSync(() => {
      if (!user) {
        return {
          success: false,
          error: {
            code: 'auth/not-ready',
            message: 'No authenticated user',
          },
        };
      }

      if (user.isAnonymous) {
        return {
          success: false,
          error: {
            code: 'auth/anonymous',
            message: 'Cannot delete anonymous account',
          },
        };
      }

      const provider = this.getUserAuthProvider(user);
      if (!provider) {
        return {
          success: false,
          error: {
            code: 'auth/unsupported',
            message: 'Unsupported auth provider',
          },
        };
      }

      return successResult({
        userId: user.uid,
        provider,
      });
    }, 'account-deletion/validation-failed');
  }

  /**
   * Get user's auth provider
   */
  private getUserAuthProvider(user: User): string | null {
    if (!user.providerData || user.providerData.length === 0) {
      return null;
    }

    for (const userInfo of user.providerData) {
      if (userInfo.providerId) {
        return userInfo.providerId;
      }
    }

    return null;
  }

  /**
   * Check if user is email/password user
   */
  isEmailPasswordUser(user: User): boolean {
    return this.getUserAuthProvider(user) === 'password';
  }

  /**
   * Check if user is Google user
   */
  isGoogleUser(user: User): boolean {
    return this.getUserAuthProvider(user) === 'google.com';
  }

  /**
   * Check if user is Apple user
   */
  isAppleUser(user: User): boolean {
    return this.getUserAuthProvider(user) === 'apple.com';
  }

  /**
   * Get user ID from user object
   */
  getUserId(user: User): string {
    return user.uid;
  }

  /**
   * Check if user email is verified
   */
  isEmailVerified(user: User): boolean {
    return user.emailVerified || false;
  }

  /**
   * Get user email
   */
  getEmail(user: User): string | null {
    return user.email || null;
  }

  /**
   * Get account creation time
   */
  getCreationTime(user: User): Date | null {
    if (!user.metadata.creationTime) {
      return null;
    }
    return new Date(user.metadata.creationTime);
  }

  /**
   * Get last sign-in time
   */
  getLastSignInTime(user: User): Date | null {
    if (!user.metadata.lastSignInTime) {
      return null;
    }
    return new Date(user.metadata.lastSignInTime);
  }

  /**
   * Check if account is new (created within specified days)
   */
  isAccountNew(user: User, maxAgeDays: number = 1): boolean {
    const creationTime = this.getCreationTime(user);
    if (!creationTime) return false;

    const ageMs = Date.now() - creationTime.getTime();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

    return ageMs <= maxAgeMs;
  }

  /**
   * Check if user recently signed in
   */
  isRecentSignIn(user: User, maxAgeMinutes: number = 5): boolean {
    const lastSignIn = this.getLastSignInTime(user);
    if (!lastSignIn) return false;

    const timeSinceSignIn = Date.now() - lastSignIn.getTime();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    return timeSinceSignIn <= maxAgeMs;
  }

  /**
   * Mark user as deleted in database
   * Separate method for flexibility
   */
  async markUserDeleted(userId: string): Promise<Result<void>> {
    return this.execute(async () => {
      this.log('Marking user as deleted', { userId });

      const marked = await markUserDeleted(userId);
      if (!marked) {
        this.logError('Failed to mark user as deleted in database');
      }

      return successResult();
    }, 'account-deletion/mark-failed');
  }

  /**
   * Cleanup user data
   * Override in subclass for custom cleanup logic
   */
  protected async cleanupUserData(userId: string): Promise<Result<void>> {
    return this.execute(async () => {
      this.log('Cleaning up user data', { userId });
      // Override in subclass for custom cleanup
      return successResult();
    }, 'account-deletion/cleanup-failed');
  }

  /**
   * Complete deletion with cleanup
   * Deletes account and cleans up user data
   */
  async deleteWithCleanup(user: User): Promise<Result<void>> {
    return this.execute(async () => {
      this.log('Starting deletion with cleanup', { userId: user.uid });

      // Delete account (includes marking document as deleted)
      const deleteResult = await this.deleteAccount(user);
      if (!deleteResult.success) {
        return deleteResult;
      }

      // Cleanup additional user data
      const cleanupResult = await this.cleanupUserData(user.uid);
      if (!cleanupResult.success) {
        this.logError('Cleanup failed, but account was deleted', {
          userId: user.uid,
          error: cleanupResult.error,
        });
      }

      this.log('Deletion with cleanup completed', { userId: user.uid });
    }, 'account-deletion/complete-failed');
  }
}

/**
 * Factory function to create account deletion repository
 */
export function createAccountDeletionRepository(): AccountDeletionRepository {
  return new AccountDeletionRepository();
}

/**
 * Default singleton instance
 */
export const accountDeletionRepository = createAccountDeletionRepository();
