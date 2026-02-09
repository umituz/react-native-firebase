/**
 * Service Client Singleton Base Class
 *
 * Provides a generic singleton pattern for Firebase service clients.
 * Eliminates code duplication across FirebaseClient, FirestoreClient, FirebaseAuthClient.
 *
 * Features:
 * - Generic singleton pattern
 * - Initialization state management
 * - Error handling and tracking
 * - Automatic cleanup
 *
 * @template TInstance - The service instance type (e.g., Firestore, Auth)
 * @template TConfig - The configuration type (optional)
 */

export interface ServiceClientState<TInstance> {
  instance: TInstance | null;
  initializationError: string | null;
  isInitialized: boolean;
}

export interface ServiceClientOptions<TInstance, TConfig = unknown> {
  serviceName: string;
  initializer?: (config?: TConfig) => TInstance | null;
  autoInitializer?: () => TInstance | null;
}

/**
 * Generic service client singleton base class
 * Provides common initialization, state management, and error handling
 */
export class ServiceClientSingleton<TInstance, TConfig = unknown> {
  private static instances = new Map<string, ServiceClientSingleton<unknown, unknown>>();

  protected state: ServiceClientState<TInstance>;
  private readonly options: ServiceClientOptions<TInstance, TConfig>;

  constructor(options: ServiceClientOptions<TInstance, TConfig>) {
    this.options = options;
    this.state = {
      instance: null,
      initializationError: null,
      isInitialized: false,
    };
  }

  /**
   * Initialize the service with optional configuration
   */
  initialize(config?: TConfig): TInstance | null {
    if (this.state.isInitialized && this.state.instance) {
      return this.state.instance;
    }

    if (this.state.initializationError) {
      return null;
    }

    try {
      const instance = this.options.initializer ? this.options.initializer(config) : null;
      if (instance) {
        this.state.instance = instance;
        this.state.isInitialized = true;
      }
      return instance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to initialize ${this.options.serviceName}`;
      this.state.initializationError = errorMessage;

      if (__DEV__) {
        console.error(`[${this.options.serviceName}] Initialization failed:`, errorMessage);
      }

      return null;
    }
  }

  /**
   * Get the service instance, auto-initializing if needed
   */
  getInstance(autoInit: boolean = false): TInstance | null {
    if (this.state.instance) {
      return this.state.instance;
    }

    if (this.state.initializationError) {
      return null;
    }

    if (autoInit && this.options.autoInitializer) {
      try {
        const instance = this.options.autoInitializer();
        if (instance) {
          this.state.instance = instance;
          this.state.isInitialized = true;
        }
        return instance;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Failed to initialize ${this.options.serviceName}`;
        this.state.initializationError = errorMessage;

        if (__DEV__) {
          console.error(`[${this.options.serviceName}] Auto-initialization failed:`, errorMessage);
        }
      }
    }

    return null;
  }

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Get the initialization error if any
   */
  getInitializationError(): string | null {
    return this.state.initializationError;
  }

  /**
   * Reset the service state
   */
  reset(): void {
    this.state.instance = null;
    this.state.initializationError = null;
    this.state.isInitialized = false;

    if (__DEV__) {
      console.log(`[${this.options.serviceName}] Service reset`);
    }
  }

  /**
   * Get the current instance without initialization
   */
  protected getCurrentInstance(): TInstance | null {
    return this.state.instance;
  }

  /**
   * Set initialization error
   */
  protected setError(error: string): void {
    this.state.initializationError = error;
  }
}
