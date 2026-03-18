/**
 * Account Deletion Types
 * Single Responsibility: Define account deletion types
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Result } from '../../../../shared/domain/utils';

/**
 * Account deletion result
 */
export interface AccountDeletionResult extends Result<void> {
  readonly requiresReauth?: boolean;
}

/**
 * Reauthentication context
 */
export interface ReauthenticationContext {
  readonly user: import('firebase/auth').User;
  readonly options: import('../../application/ports/reauthentication.types').AccountDeletionOptions;
  readonly originalUserId?: string;
}

/**
 * Reauthentication result
 */
export interface ReauthenticationResult {
  readonly success: boolean;
  readonly error?: { code?: string; message?: string };
}
