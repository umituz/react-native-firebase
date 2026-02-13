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
  GoogleOAuthService,
  googleOAuthService,
} from './infrastructure/services/google-oauth.service';
export type {
  GoogleOAuthConfig,
} from './infrastructure/services/google-oauth.service';

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

export { useGoogleOAuth } from './presentation/hooks/useGoogleOAuth';
export type {
  UseGoogleOAuthResult,
} from './presentation/hooks/useGoogleOAuth';

// Password Management
export {
  updateUserPassword,
} from './infrastructure/services/password.service';
export type { PasswordUpdateResult } from './infrastructure/services/password.service';

// Email/Password Authentication
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  linkAnonymousWithEmail,
} from './infrastructure/services/email-auth.service';
export type {
  EmailCredentials,
  EmailAuthResult,
} from './infrastructure/services/email-auth.service';

// Auth Listener
export {
  setupAuthListener,
} from './infrastructure/services/auth-listener.service';
export type {
  AuthListenerConfig,
  AuthListenerResult,
} from './infrastructure/services/auth-listener.service';

// User Document Service
export {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService,
} from './infrastructure/services/user-document.service';
export type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from './infrastructure/services/user-document.types';


