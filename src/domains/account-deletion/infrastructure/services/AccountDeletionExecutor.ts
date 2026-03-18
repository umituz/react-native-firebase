/**
 * Account Deletion Executor
 * Handles Firebase account deletion with reauthentication support
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from 'firebase/auth';
import type { AccountDeletionOptions } from '../../application/ports/reauthentication.types';
import type { AccountDeletionResult } from './AccountDeletionTypes';

export class AccountDeletionExecutor {
  private deletionInProgress = false;

  async deleteCurrentUser(options: AccountDeletionOptions): Promise<AccountDeletionResult> {
    if (this.deletionInProgress) {
      return {
        success: false,
        error: {
          code: 'deletion-in-progress',
          message: 'Account deletion is already in progress',
        },
      };
    }

    this.deletionInProgress = true;

    try {
      // TODO: Implement actual deletion logic
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'deletion-failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    } finally {
      this.deletionInProgress = false;
    }
  }

  async deleteUserAccount(user: User | null): Promise<AccountDeletionResult> {
    if (!user) {
      return {
        success: false,
        error: {
          code: 'no-user',
          message: 'No user provided',
        },
      };
    }

    try {
      await user.delete();
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'deletion-failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  isDeletionInProgress(): boolean {
    return this.deletionInProgress;
  }
}

export const accountDeletionExecutor = new AccountDeletionExecutor();
export const createAccountDeletionExecutor = () => new AccountDeletionExecutor();
