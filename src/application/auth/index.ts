/**
 * Auth Application Layer
 * Domain-Driven Design (DDD) - Application Exports
 *
 * Application use cases and ports for authentication.
 * Coordinates domain services and infrastructure.
 */

// Ports
export type {
  EmailCredentials,
  SignInResult,
  SignUpResult,
  AuthPortOptions,
  AuthPortConfig,
  IAuthPortFactory,
} from './ports/AuthPort';

export {
  type IAuthPort,
  createAuthPortConfig,
  AuthPortFactory,
  authPortFactory,
  createAuthPort,
} from './ports/AuthPort';

// Use Cases
export type {
  SignInUseCaseResult,
  SignInOptions,
  SignOutUseCaseResult,
  SignOutOptions,
} from './use-cases';

export {
  SignInUseCase,
  createSignInUseCase,
  createDefaultSignInUseCase,
  SignOutUseCase,
  createSignOutUseCase,
  createDefaultSignOutUseCase,
} from './use-cases';
