/**
 * Firebase Auth Presentation Layer
 * Domain-Driven Design (DDD) - Presentation Exports
 *
 * React hooks for Firebase authentication.
 * Provides clean interface for UI components.
 */

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

export { useAppleAuth } from './presentation/hooks/useAppleAuth';
export type {
  UseAppleAuthResult,
  AppleAuthSignInResult,
} from './presentation/hooks/useAppleAuth';
