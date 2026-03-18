/**
 * Account Deletion Domain
 * Handles Firebase account deletion with reauthentication
 *
 * Domain-Driven Design (DDD) Architecture
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  UserValidationService,
  createUserValidationService,
  userValidationService,
} from './domain';
export type { UserValidationResult } from './domain';

// =============================================================================
// APPLICATION LAYER - Use Cases & Ports
// =============================================================================

export type {
  AccountDeletionOptions,
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult,
} from './application/ports/reauthentication.types';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

// Main Service (Refactored)
export {
  deleteCurrentUser,
  deleteUserAccount,
  isDeletionInProgress,
} from './infrastructure/services/account-deletion.service';

export type {
  AccountDeletionResult,
} from './infrastructure/services/account-deletion.service';

// Deletion Components
export {
  AccountDeletionRepository,
  createAccountDeletionRepository,
  accountDeletionRepository,
} from './infrastructure/services/AccountDeletionRepository';

export {
  AccountDeletionExecutor,
  createAccountDeletionExecutor,
  accountDeletionExecutor,
} from './infrastructure/services/AccountDeletionExecutor';

// Reauthentication Service
export {
  getUserAuthProvider,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
  reauthenticateWithApple,
  getAppleReauthCredential,
} from './infrastructure/services/reauthentication.service';
