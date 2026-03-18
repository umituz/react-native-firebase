/**
 * Account Deletion Service
 * Handles Firebase account deletion with reauthentication support
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from "firebase/auth";
import type { AccountDeletionOptions } from "../../application/ports/reauthentication.types";
import { accountDeletionExecutor } from "./AccountDeletionExecutor";
import type { AccountDeletionResult } from "./AccountDeletionTypes";

export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  return accountDeletionExecutor.deleteCurrentUser(options);
}

/**
 * Delete specific user account
 * Direct deletion without reauthentication
 *
 * @param user - User to delete
 * @returns Result of deletion operation
 */
export async function deleteUserAccount(user: User | null): Promise<AccountDeletionResult> {
  return accountDeletionExecutor.deleteUserAccount(user);
}

/**
 * Check if deletion is in progress
 * Useful for preventing concurrent deletion attempts
 *
 * @returns True if deletion is currently in progress
 */
export function isDeletionInProgress(): boolean {
  return accountDeletionExecutor.isDeletionInProgress();
}

// Re-export types for backward compatibility
export type { AccountDeletionResult };
