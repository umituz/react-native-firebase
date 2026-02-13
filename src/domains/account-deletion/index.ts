/**
 * Account Deletion Domain
 * Handles Firebase account deletion with reauthentication
 */

export {
  deleteCurrentUser,
  deleteUserAccount,
} from './infrastructure/services/account-deletion.service';

export type {
  AccountDeletionResult,
} from './infrastructure/services/account-deletion.service';

export type {
  AccountDeletionOptions,
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult,
} from './application/ports/reauthentication.types';

export {
  getUserAuthProvider,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
  reauthenticateWithApple,
  getAppleReauthCredential,
} from './infrastructure/services/reauthentication.service';
