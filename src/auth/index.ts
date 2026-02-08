/**
 * Firebase Auth Module
 * Domain-Driven Design (DDD) Architecture
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export type { FirebaseAuthConfig } from './domain/value-objects/FirebaseAuthConfig';

// Anonymous User Entity
export {
  isAnonymousUser,
} from './domain/entities/AnonymousUser';
export type { AnonymousUser } from './domain/entities/AnonymousUser';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

export {
  getFirebaseAuth,
  isFirebaseAuthInitialized,
  getFirebaseAuthInitializationError,
  resetFirebaseAuthClient,
  firebaseAuthClient,
  initializeFirebaseAuth,
} from './infrastructure/config/FirebaseAuthClient';

export type {
  Auth,
} from './infrastructure/config/FirebaseAuthClient';

// Auth Utilities
export {
  checkAuthState,
  isAuthenticated,
  isAnonymous,
  getCurrentUserId,
  getCurrentUser,
  getCurrentUserIdFromGlobal,
  getCurrentUserFromGlobal,
  isCurrentUserAuthenticated,
  isCurrentUserAnonymous,
  verifyUserId,
  isValidUser,
} from './infrastructure/services/auth-utils.service';

export type {
  AuthCheckResult,
} from './infrastructure/services/auth-utils.service';

// Anonymous Auth Service
export {
  AnonymousAuthService,
  anonymousAuthService,
} from './infrastructure/services/anonymous-auth.service';

export type {
  AnonymousAuthResult,
  AnonymousAuthServiceInterface,
} from './infrastructure/services/anonymous-auth.service';

// Firestore Utilities
export {
  shouldSkipFirestoreQuery,
  createFirestoreQueryOptions,
} from './infrastructure/services/firestore-utils.service';

export type {
  FirestoreQueryOptions,
  FirestoreQueryResult,
  FirestoreQuerySkipReason,
} from './infrastructure/services/firestore-utils.service';

// Account Deletion
export {
  deleteCurrentUser,
  deleteUserAccount,
} from './infrastructure/services/account-deletion.service';

export type { AccountDeletionResult, AccountDeletionOptions } from './infrastructure/services/account-deletion.service';

// Reauthentication Service
export {
  getUserAuthProvider,
  reauthenticateWithGoogle,
  reauthenticateWithApple,
  reauthenticateWithPassword,
  getAppleReauthCredential,
} from './infrastructure/services/reauthentication.service';

export type {
  ReauthenticationResult,
  AuthProviderType,
} from './infrastructure/services/reauthentication.service';

// =============================================================================
// INFRASTRUCTURE LAYER - Social Auth Services
// =============================================================================

export {
  GoogleAuthService,
  googleAuthService,
} from './infrastructure/services/google-auth.service';
export type {
  GoogleAuthConfig,
  GoogleAuthResult,
} from './infrastructure/services/google-auth.types';

export {
  AppleAuthService,
  appleAuthService,
} from './infrastructure/services/apple-auth.service';
export type { AppleAuthResult } from './infrastructure/services/apple-auth.types';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useFirebaseAuth } from './presentation/hooks/useFirebaseAuth';
export type { UseFirebaseAuthResult } from './presentation/hooks/useFirebaseAuth';

export { useAnonymousAuth } from './presentation/hooks/useAnonymousAuth';
export type { UseAnonymousAuthResult } from './presentation/hooks/useAnonymousAuth';

export { useSocialAuth } from './presentation/hooks/useSocialAuth';
export type {
  SocialAuthConfig,
  SocialAuthResult,
  UseSocialAuthResult,
} from './presentation/hooks/useSocialAuth';

// Password Management
export {
  updateUserPassword,
} from './infrastructure/services/password.service';
export type { PasswordUpdateResult } from './infrastructure/services/password.service';

