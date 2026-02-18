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

interface ServiceClientState<TInstance> {
  instance: TInstance | null;
  initializationError: string | null;
  isInitialized: boolean;
}

interface ServiceClientOptions<TInstance, TConfig = unknown> {
  serviceName: string;
  initializer?: (config?: TConfig) => TInstance | null;
  autoInitializer?: () => TInstance | null;
}

/**
 * Generic service client singleton base class
 * Provides common initialization, state management, and error handling
 */
export class ServiceClientSingleton<TInstance, TConfig = unknown> {
  protected state: ServiceClientState<TInstance>;
  private readonly options: ServiceClientOptions<TInstance, TConfig>;
  private initInProgress = false;

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

    // Prevent concurrent initialization attempts
    if (this.initInProgress) {
      return null;
    }

    this.initInProgress = true;
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
      return null;
    } finally {
      this.initInProgress = false;
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

    // Prevent concurrent auto-initialization attempts
    if (this.initInProgress) {
      return null;
    }

    if (autoInit && this.options.autoInitializer) {
      this.initInProgress = true;
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
      } finally {
        this.initInProgress = false;
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
    this.initInProgress = false;
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
