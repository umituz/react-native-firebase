/**
 * Error Handler
 * Centralized error handling for services
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Result } from '../../domain/utils';

export interface ErrorHandlerOptions {
  readonly serviceName?: string;
  readonly defaultErrorCode?: string;
}

export interface ErrorInfo {
  readonly code: string;
  readonly message: string;
}

export class ErrorHandler {
  readonly serviceName: string;
  readonly defaultErrorCode: string;

  constructor(options: ErrorHandlerOptions = {}) {
    this.serviceName = options.serviceName || 'Service';
    this.defaultErrorCode = options.defaultErrorCode || 'ERROR';
  }

  async handleAsync<T>(
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
        error: this.toErrorInfo(error, errorCode),
      };
    }
  }

  handle<T>(operation: () => T, errorCode?: string): Result<T> {
    try {
      const result = operation();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: this.toErrorInfo(error, errorCode),
      };
    }
  }

  toErrorInfo(error: unknown, code?: string): ErrorInfo {
    if (error instanceof Error) {
      return {
        code: code || this.defaultErrorCode,
        message: error.message,
      };
    }

    return {
      code: code || this.defaultErrorCode,
      message: String(error),
    };
  }

  getUserMessage(error: ErrorInfo): string {
    return error.message;
  }
}

export const defaultErrorHandler = new ErrorHandler();
