/**
 * Firebase Client State Manager
 * Manages the state of Firebase initialization
 *
 * Single Responsibility: Only manages initialization state
 */

import type { FirebaseApp } from '../initializers/FirebaseAppInitializer';

export class FirebaseClientState {
  private app: FirebaseApp | null = null;
  private initializationError: string | null = null;

  getApp(): FirebaseApp | null {
    return this.app;
  }

  setApp(app: FirebaseApp | null): void {
    this.app = app;
  }

  isInitialized(): boolean {
    return this.app !== null;
  }

  getInitializationError(): string | null {
    return this.initializationError;
  }

  setInitializationError(error: string | null): void {
    this.initializationError = error;
  }

  reset(): void {
    this.app = null;
    this.initializationError = null;
  }
}
