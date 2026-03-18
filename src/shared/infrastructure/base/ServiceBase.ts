/**
 * Service Base Class
 * Single Responsibility: Provide common service functionality
 *
 * Base class for all services to eliminate duplication.
 * Integrates error handling and initialization.
 * Reduces service boilerplate by ~50%.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Result } from '../../domain/utils';
import { ErrorHandler, type ErrorHandlerOptions } from './ErrorHandler';
import { successResult } from '../../domain/utils';
import type { ErrorInfo } from '../../domain/utils';

/**
 * Service state
 */
interface ServiceState {
  isInitialized: boolean;
  initializationError: string | null;
}

/**
 * Service base options
 */
export interface ServiceBaseOptions extends ErrorHandlerOptions {
  /** Service name for logging and error messages */
  serviceName: string;
  /** Auto-initialize on first access */
  autoInitialize?: boolean;
}

/**
 * Base class for all services
 * Provides common initialization, error handling, and state management
 *
 * Usage:
 * ```typescript
 * class MyService extends ServiceBase {
 *   constructor() {
 *     super({ serviceName: 'MyService' });
 *   }
 *
 *   async myMethod() {
 *     return this.handleAsync(async () => {
 *       // Your logic here
 *       return result;
 *     }, 'my-method/failed');
 *   }
 * }
 * ```
 */
export abstract class ServiceBase {
  protected readonly errorHandler: ErrorHandler;
  protected readonly serviceName: string;
  protected readonly autoInitialize: boolean;
  protected state: ServiceState;
  private initInProgress = false;

  constructor(options: ServiceBaseOptions) {
    this.serviceName = options.serviceName;
    this.autoInitialize = options.autoInitialize ?? false;
    this.errorHandler = new ErrorHandler({
      ...options,
      defaultErrorCode: `${this.serviceName.toLowerCase()}/error`,
    });
    this.state = {
      isInitialized: false,
      initializationError: null,
    };
  }

  /**
   * Initialize the service
   * Override this method to provide custom initialization logic
   */
  protected async initialize(): Promise<Result<void>> {
    // Override in subclasses
    this.state.isInitialized = true;
    return successResult();
  }

  /**
   * Ensure service is initialized before operation
   * Automatically initializes if autoInitialize is enabled
   */
  protected async ensureInitialized(): Promise<Result<void>> {
    if (this.state.isInitialized) {
      return successResult();
    }

    if (this.state.initializationError) {
      return {
        success: false,
        error: {
          code: `${this.serviceName.toLowerCase()}/initialization-failed`,
          message: this.state.initializationError,
        },
      };
    }

    if (this.initInProgress) {
      return {
        success: false,
        error: {
          code: `${this.serviceName.toLowerCase()}/initialization-in-progress`,
          message: 'Service initialization is in progress',
        },
      };
    }

    if (!this.autoInitialize) {
      return {
        success: false,
        error: {
          code: `${this.serviceName.toLowerCase()}/not-initialized`,
          message: 'Service is not initialized. Call initialize() first.',
        },
      };
    }

    this.initInProgress = true;
    try {
      const result = await this.initialize();
      if (!result.success) {
        this.state.initializationError = result.error?.message || 'Initialization failed';
        return result;
      }
      this.state.isInitialized = true;
      return successResult();
    } finally {
      this.initInProgress = false;
    }
  }

  /**
   * Wrap async operation with error handling and initialization check
   */
  protected async execute<T>(
    operation: () => Promise<T>,
    errorCode?: string
  ): Promise<Result<T>> {
    const initResult = await this.ensureInitialized();
    if (!initResult.success) {
      return {
        success: false,
        error: initResult.error,
      };
    }

    return this.errorHandler.handleAsync(operation, errorCode);
  }

  /**
   * Wrap sync operation with error handling
   */
  protected executeSync<T>(operation: () => T, errorCode?: string): Result<T> {
    return this.errorHandler.handle(operation, errorCode);
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null {
    return this.state.initializationError;
  }

  /**
   * Reset service state
   * Override to add custom cleanup logic
   */
  reset(): void {
    this.state = {
      isInitialized: false,
      initializationError: null,
    };
    this.initInProgress = false;
  }

  /**
   * Get service name
   */
  getServiceName(): string {
    return this.serviceName;
  }

  /**
   * Log in development mode
   */
  protected log(message: string, ...args: unknown[]): void {
    if (__DEV__) {
      console.log(`[${this.serviceName}] ${message}`, ...args);
    }
  }

  /**
   * Log error in development mode
   */
  protected logError(message: string, error?: unknown): void {
    if (__DEV__) {
      console.error(`[${this.serviceName}] ${message}`, error);
    }
  }

  /**
   * Create a failure result
   */
  protected failure(code: string, message?: string): Result {
    return this.errorHandler.failureFrom(code, message);
  }
}
