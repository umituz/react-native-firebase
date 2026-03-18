/**
 * Shared Infrastructure Base Classes
 *
 * Eliminates code duplication across the codebase.
 * Provides common functionality for services, error handling, and type guards.
 *
 * Usage:
 * ```typescript
 * import { ServiceBase, ErrorHandler, hasCodeProperty } from '@umituz/react-native-firebase/base';
 * ```
 */

// ServiceBase - Base class for all services
export { ServiceBase, type ServiceBaseOptions } from './ServiceBase';

// ErrorHandler - Centralized error handling
export { ErrorHandler, defaultErrorHandler, type ErrorHandlerOptions } from './ErrorHandler';

// TypedGuard - Type-safe guard utilities
export {
  hasCodeProperty,
  hasMessageProperty,
  isFirebaseErrorLike,
  hasNameProperty,
  isErrorLike,
  hasUidProperty,
  hasEmailProperty,
  hasProviderIdProperty,
  isArray,
  isString,
  isFunction,
  hasProperty,
  hasProperties,
} from './TypedGuard';
