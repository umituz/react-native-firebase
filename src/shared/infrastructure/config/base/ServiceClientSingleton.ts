/**
 * Service Client Singleton Base
 * Base singleton pattern for service clients
 *
 * Max lines: 150 (enforced for maintainability)
 */

export abstract class ServiceClientSingleton<TInstance, TConfig = unknown> {
  protected instance: TInstance | null = null;
  protected initializationError: Error | null = null;

  protected constructor() {}

  abstract initialize(config?: TConfig): Promise<TInstance> | TInstance;

  getInstance(): TInstance {
    if (!this.instance) {
      throw new Error('Service not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  isInitialized(): boolean {
    return this.instance !== null;
  }

  getInitializationError(): Error | null {
    return this.initializationError;
  }

  setError(message: string): void {
    this.initializationError = new Error(message);
  }

  reset(): void {
    this.instance = null;
    this.initializationError = null;
  }
}
