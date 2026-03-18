/**
 * Account Deletion Domain
 * Handles Firebase account deletion with reauthentication
 *
 * Domain-Driven Design (DDD) Architecture
 */

export type {
  AccountDeletionOptions,
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult,
} from './application/ports/reauthentication.types';

export {
  deleteCurrentUser,
  deleteUserAccount,
  isDeletionInProgress,
} from './infrastructure/services/account-deletion.service';

export type {
  AccountDeletionResult,
} from './infrastructure/services/account-deletion.service';
