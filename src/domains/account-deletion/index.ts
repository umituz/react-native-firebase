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

export { PasswordPromptScreen } from './presentation/components/PasswordPromptScreen';
export type { PasswordPromptScreenProps } from './presentation/components/PasswordPromptScreen';

export { usePasswordPrompt } from './presentation/hooks/usePasswordPrompt';
export type { UsePasswordPromptOptions, UsePasswordPromptReturn } from './presentation/hooks/usePasswordPrompt';
