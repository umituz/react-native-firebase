/**
 * Validation Utility
 * Re-exports all validators for backward compatibility
 * @deprecated Import from specific validator files instead
 */

// String Validators
export { isValidString, isEmptyString, isDefined } from './validators/string.validator';

// Firebase Validators
export {
  isValidFirebaseApiKey,
  isValidFirebaseAuthDomain,
  isValidFirebaseProjectId,
} from './validators/firebase.validator';

// URL Validators
export { isValidUrl, isValidHttpsUrl } from './validators/url.validator';

// User Input Validators
export {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  isValidPhoneNumber,
} from './validators/user-input.validator';

// Generic Validators
export {
  isNonEmptyArray,
  isInRange,
  isPositive,
  isNonNegative,
  hasRequiredProperties,
  allMatch,
  anyMatch,
} from './validators/generic.validator';

// Composite Validators
export { combineValidators, anyValidator } from './validators/composite.validator';
