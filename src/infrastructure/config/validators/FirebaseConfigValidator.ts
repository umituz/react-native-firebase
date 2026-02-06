/**
 * Firebase Configuration Validator
 *
 * Single Responsibility: Validates Firebase configuration
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseConfigurationError } from '../../../domain/errors/FirebaseError';

/**
 * Validation rule interface
 */
interface ValidationRule {
  validate(config: FirebaseConfig): void;
}

/**
 * Required field validation rule
 */
class RequiredFieldRule implements ValidationRule {
  constructor(
    private fieldName: string,
    private getter: (config: FirebaseConfig) => string | undefined
  ) {}

  validate(config: FirebaseConfig): void {
    const value = this.getter(config);
    
    if (!value || typeof value !== 'string') {
      throw new FirebaseConfigurationError(
        `Firebase ${this.fieldName} is required and must be a string`
      );
    }

    if (value.trim().length === 0) {
      throw new FirebaseConfigurationError(`Firebase ${this.fieldName} cannot be empty`);
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
    new RequiredFieldRule('API Key', config => config.apiKey),
    new RequiredFieldRule('Auth Domain', config => config.authDomain),
    new RequiredFieldRule('Project ID', config => config.projectId),
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








