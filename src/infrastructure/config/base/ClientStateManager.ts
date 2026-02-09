/**
 * Client State Manager
 *
 * Generic state management for Firebase service clients.
 * Provides centralized state tracking for initialization status, errors, and instances.
 *
 * @template TInstance - The service instance type (e.g., FirebaseApp, Firestore, Auth)
 */

export interface ClientState<TInstance> {
  instance: TInstance | null;
  initializationError: string | null;
  isInitialized: boolean;
}

/**
 * Generic client state manager
 * Handles initialization state, error tracking, and instance management
 */
export class ClientStateManager<TInstance> {
  private state: ClientState<TInstance>;

  constructor() {
    this.state = {
      instance: null,
      initializationError: null,
      isInitialized: false,
    };
  }

  /**
   * Get the current instance
   */
  getInstance(): TInstance | null {
    return this.state.instance;
  }

  /**
   * Set the instance
   */
  setInstance(instance: TInstance | null): void {
    this.state.instance = instance;
    this.state.isInitialized = instance !== null;
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
   * Set the initialization error
   */
  setInitializationError(error: string | null): void {
    this.state.initializationError = error;
  }

  /**
   * Reset the state
   */
  reset(): void {
    this.state.instance = null;
    this.state.initializationError = null;
    this.state.isInitialized = false;
  }

  /**
   * Get the current state (read-only)
   */
  getState(): Readonly<ClientState<TInstance>> {
    return this.state;
  }
}
