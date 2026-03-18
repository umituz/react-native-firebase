/**
 * Service Client Singleton Base
 * Base singleton pattern for service clients
 *
 * Max lines: 150 (enforced for maintainability)
 */

export abstract class ServiceClientSingleton<TInstance> {
  protected instance: TInstance | null = null;

  protected constructor() {}

  abstract initialize(): Promise<TInstance>;

  getInstance(): TInstance {
    if (!this.instance) {
      throw new Error('Service not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  isInitialized(): boolean {
    return this.instance !== null;
  }

  reset(): void {
    this.instance = null;
  }
}
