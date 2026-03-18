/**
 * Service Base
 * Base class for all services with common functionality
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Result } from '../../domain/utils';

export interface ServiceBaseOptions {
  readonly serviceName?: string;
}

export class ServiceBase {
  readonly serviceName: string;

  constructor(options: ServiceBaseOptions = {}) {
    this.serviceName = options.serviceName || 'Service';
  }

  protected async execute<T>(
    operation: () => Promise<T>,
    errorCode?: string
  ): Promise<Result<T>> {
    try {
      const result = await operation();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: errorCode || `${this.serviceName}_ERROR`,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  protected executeSync<T>(
    operation: () => T,
    errorCode?: string
  ): Result<T> {
    try {
      const result = operation();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: errorCode || `${this.serviceName}_ERROR`,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
