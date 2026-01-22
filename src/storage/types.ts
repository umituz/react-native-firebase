/**
 * Firebase Storage Types
 * Shared types for storage operations
 */

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

export interface UploadOptions {
  mimeType?: string;
  customMetadata?: Record<string, string>;
}

export interface DeleteResult {
  success: boolean;
  storagePath: string;
}

export { Directory as FileSystemDirectory } from "expo-file-system";
