/**
 * User Document Types and Configuration
 */

/**
 * Minimal user interface for document creation
 * Compatible with both Firebase User and AuthUser
 */
export interface UserDocumentUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

/**
 * Configuration for user document service
 */
export interface UserDocumentConfig {
  /** Firestore collection name (default: "users") */
  collectionName?: string;
  /** Additional fields to store with user document */
  extraFields?: Record<string, unknown>;
  /** Callback to collect device/app info */
  collectExtras?: () => Promise<UserDocumentExtras>;
}

/**
 * User document extras from device/app
 */
export interface UserDocumentExtras {
  [key: string]: string | number | boolean | null | undefined;
  deviceId?: string;
  persistentDeviceId?: string;
  nativeDeviceId?: string;
  platform?: string;
  deviceModel?: string;
  deviceBrand?: string;
  deviceName?: string;
  deviceType?: number | string;
  deviceYearClass?: number | string;
  isDevice?: boolean;
  osName?: string;
  osVersion?: string;
  osBuildId?: string;
  totalMemory?: number | string;
  appVersion?: string;
  buildNumber?: string;
  locale?: string;
  region?: string;
  timezone?: string;
  screenWidth?: number;
  screenHeight?: number;
  screenScale?: number;
  fontScale?: number;
  isLandscape?: boolean;
  previousAnonymousUserId?: string;
  signUpMethod?: string;
}
