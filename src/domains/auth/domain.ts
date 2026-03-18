/**
 * Firebase Auth Domain Layer
 * Domain-Driven Design (DDD) - Domain Exports
 *
 * Pure domain logic without infrastructure concerns.
 * Exports domain entities, value objects, and domain services.
 */

// Domain Value Objects
export type { FirebaseAuthConfig } from './domain/value-objects/FirebaseAuthConfig';

// Domain Entities
export {
  isAnonymousUser,
} from './domain/entities/AnonymousUser';
export type { AnonymousUser } from './domain/entities/AnonymousUser';
