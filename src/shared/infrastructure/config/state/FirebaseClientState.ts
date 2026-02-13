/**
 * Firebase Client State Manager
 * Manages the state of Firebase initialization
 *
 * Single Responsibility: Only manages initialization state
 * Uses generic ClientStateManager for shared functionality
 */

import type { FirebaseApp } from '../initializers/FirebaseAppInitializer';
import { ClientStateManager } from '../base/ClientStateManager';

export class FirebaseClientState extends ClientStateManager<FirebaseApp> {
  getApp(): FirebaseApp | null {
    return this.getInstance();
  }

  setApp(app: FirebaseApp | null): void {
    this.setInstance(app);
  }
}
