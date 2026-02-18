/**
 * Firebase Admin Scripts - Shared Types
 * Generic types for Firebase Admin operations
 */

export interface FirebaseAdminConfig {
  /** Path to service account JSON file */
  serviceAccountPath: string;
  /** Firebase project ID */
  projectId: string;
  /** Storage bucket name (optional) */
  storageBucket?: string;
}

export interface CollectionInfo {
  name: string;
  documentCount: number;
  sampleDocumentId?: string;
  hasSubcollections?: boolean;
}

export interface UserInfo {
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  createdAt?: Date;
  providerCount: number;
}

export interface CleanupResult {
  totalProcessed: number;
  deleted: number;
  preserved: number;
  errors: string[];
}

export interface BatchResult {
  success: boolean;
  processed: number;
  errors: string[];
}

export interface StorageFileInfo {
  name: string;
  size: number;
  contentType?: string;
  createdAt?: Date;
}

export interface ResetSummary {
  authUsersDeleted: number;
  firestoreDocsDeleted: number;
  storageFilesDeleted: number;
}

/** User credits data */
export interface UserCredits {
  text: number;
  image: number;
  video: number;
  audio: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Complete user data including all related collections */
export interface UserData {
  userId: string;
  exists: boolean;
  profile: Record<string, unknown> | null;
  credits: UserCredits | null;
  subscriptions: Array<Record<string, unknown>>;
  transactions: Array<Record<string, unknown>>;
}

/** Credits initialization config */
export interface CreditsConfig {
  collectionName?: string;
  textLimit?: number;
  imageLimit?: number;
  videoLimit?: number;
  audioLimit?: number;
}
