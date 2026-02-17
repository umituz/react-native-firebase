/**
 * Firebase Configuration Validator
 *
 * Single Responsibility: Validates Firebase configuration
 * Uses centralized validation utilities from validation.util.ts
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseConfigurationError } from '../../../domain/errors/FirebaseError';
import { isValidString } from '../../../domain/utils/validators/string.validator';
import { isValidFirebaseApiKey, isValidFirebaseProjectId, isValidFirebaseAuthDomain } from '../../../domain/utils/validators/firebase.validator';

/**
 * Validation rule interface
 */
interface ValidationRule {
  validate(config: FirebaseConfig): void;
}

/**
 * Required field validation rule using centralized validation
 */
class RequiredFieldRule implements ValidationRule {
  constructor(
    private fieldName: string,
    private getter: (config: FirebaseConfig) => string | undefined,
    private customValidator?: (value: string) => boolean
  ) {}

  validate(config: FirebaseConfig): void {
    const value = this.getter(config);

    if (!isValidString(value)) {
      throw new FirebaseConfigurationError(
        `Firebase ${this.fieldName} is required and must be a non-empty string`
      );
    }

    if (this.customValidator && !this.customValidator(value)) {
      throw new FirebaseConfigurationError(
        `Firebase ${this.fieldName} format is invalid`
      );
    }
  }
}

/**
 * Placeholder validation rule
 */
class PlaceholderRule implements ValidationRule {
  constructor(
    private fieldName: string,
    private getter: (config: FirebaseConfig) => string | undefined,
    private placeholder: string
  ) {}

  validate(config: FirebaseConfig): void {
    const value = this.getter(config);

    if (value && value.includes(this.placeholder)) {
      throw new FirebaseConfigurationError(
        `Please replace placeholder values with actual Firebase credentials for ${this.fieldName}`
      );
    }
  }
}

/**
 * Firebase Configuration Validator
 */
export class FirebaseConfigValidator {
  private static rules: ValidationRule[] = [
    new RequiredFieldRule('API Key', config => config.apiKey, isValidFirebaseApiKey),
    new RequiredFieldRule('Auth Domain', config => config.authDomain, isValidFirebaseAuthDomain),
    new RequiredFieldRule('Project ID', config => config.projectId, isValidFirebaseProjectId),
    new PlaceholderRule('API Key', config => config.apiKey, 'your_firebase_api_key'),
    new PlaceholderRule('Project ID', config => config.projectId, 'your-project-id'),
  ];

  /**
   * Validate Firebase configuration
   * @throws {FirebaseConfigurationError} If configuration is invalid
   */
  static validate(config: FirebaseConfig): void {
    for (const rule of this.rules) {
      rule.validate(config);
    }
  }
}
