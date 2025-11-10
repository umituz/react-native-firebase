/**
 * Firebase Configuration Validator
 *
 * Single Responsibility: Validates Firebase configuration
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseConfigurationError } from '../../../domain/errors/FirebaseError';

/**
 * Validates Firebase configuration
 */
export class FirebaseConfigValidator {
  /**
   * Validate Firebase configuration
   * @throws {FirebaseConfigurationError} If configuration is invalid
   */
  static validate(config: FirebaseConfig): void {
    if (!config.apiKey || typeof config.apiKey !== 'string') {
      throw new FirebaseConfigurationError(
        'Firebase API Key is required and must be a string'
      );
    }

    if (!config.authDomain || typeof config.authDomain !== 'string') {
      throw new FirebaseConfigurationError(
        'Firebase Auth Domain is required and must be a string'
      );
    }

    if (!config.projectId || typeof config.projectId !== 'string') {
      throw new FirebaseConfigurationError(
        'Firebase Project ID is required and must be a string'
      );
    }

    if (config.apiKey.trim().length === 0) {
      throw new FirebaseConfigurationError('Firebase API Key cannot be empty');
    }

    if (
      config.apiKey.includes('your_firebase_api_key') ||
      config.projectId.includes('your-project-id')
    ) {
      throw new FirebaseConfigurationError(
        'Please replace placeholder values with actual Firebase credentials'
      );
    }
  }
}


