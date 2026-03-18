/**
 * Account Deletion Service (Refactored)
 * Handles Firebase account deletion with reauthentication support
 *
 * This file now delegates to the new DDD architecture:
 * - AccountDeletionExecutor for deletion logic
 * - UserValidationService for validation
 * - AccountDeletionRepository for persistence
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { User } from "firebase/auth";
import type { AccountDeletionOptions } from "../../application/ports/reauthentication.types";
import { accountDeletionExecutor } from "./AccountDeletionExecutor";
import type { AccountDeletionResult } from "./AccountDeletionExecutor";

/**
 * Delete current user account
 * Handles reauthentication automatically if enabled
 *
 * @param options - Deletion options including reauthentication settings
 * @returns Result of deletion operation
 */
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
