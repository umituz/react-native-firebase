/**
 * Account Deletion Domain Layer
 * Domain-Driven Design (DDD) - Domain Exports
 *
 * Pure domain logic without infrastructure concerns.
 * Exports domain services for account deletion operations.
 */

// Domain Services
export {
  UserValidationService,
  createUserValidationService,
  userValidationService,
} from './services/UserValidationService';
export type { UserValidationResult } from './services/UserValidationService';
