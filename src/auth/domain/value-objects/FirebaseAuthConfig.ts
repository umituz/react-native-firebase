/**
 * Firebase Auth Configuration Value Object
 * Configuration options for Firebase Auth initialization
 */

/**
 * Storage interface for auth persistence
 */
export interface AuthStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface FirebaseAuthConfig {
  /**
   * Enable persistence (store user session across app restarts)
   * Default: true
   */
  persistence?: boolean;

  /**
   * Auth state persistence type
   * - 'local': Persist across browser/app restarts (default)
   * - 'session': Persist only for current session
   * - 'none': No persistence
   */
  persistenceType?: 'local' | 'session' | 'none';

  /**
   * Custom storage key prefix for auth state
   */
  storageKeyPrefix?: string;

  /**
   * Enable debug logging
   */
  debug?: boolean;

  /**
   * Custom auth storage implementation
   * Default: Uses AsyncStorage
   */
  authStorage?: AuthStorage;
}
