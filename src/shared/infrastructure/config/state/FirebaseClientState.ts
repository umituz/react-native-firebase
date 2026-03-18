import type { FirebaseApp } from 'firebase/app';

export class FirebaseClientState {
  private app: FirebaseApp | null = null;
  private initializationError: string | null = null;
  private isInitializedFlag = false;

  getApp(): FirebaseApp | null {
    return this.app;
  }

  setApp(app: FirebaseApp | null): void {
    this.app = app;
    this.isInitializedFlag = app !== null;
  }

  setInstance(app: FirebaseApp | null): void {
    this.setApp(app);
  }

  getInstance(): FirebaseApp | null {
    return this.getApp();
  }

  isInitialized(): boolean {
    return this.isInitializedFlag;
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
    this.isInitializedFlag = false;
  }
}
