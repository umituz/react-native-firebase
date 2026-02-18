/**
 * Firebase Admin Storage Utilities
 * Generic Storage operations for admin scripts
 */

import * as admin from "firebase-admin";
import type { StorageFileInfo, CleanupResult } from "./types";

/**
 * List all files in storage bucket
 */
export async function listFiles(
  storage: admin.storage.Storage,
  prefix?: string
): Promise<StorageFileInfo[]> {
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles({ prefix });

  return files.map((file) => ({
    name: file.name,
    size: parseInt(file.metadata.size as string, 10) || 0,
    contentType: file.metadata.contentType,
    createdAt: file.metadata.timeCreated
      ? new Date(file.metadata.timeCreated)
      : undefined,
  }));
}

/**
 * Delete all files in storage
 */
export async function deleteAllFiles(
  storage: admin.storage.Storage,
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles();

  const result: CleanupResult = {
    totalProcessed: files.length,
    deleted: 0,
    preserved: 0,
    errors: [],
  };

  for (const file of files) {
    try {
      await file.delete();
      result.deleted++;
      onProgress?.(result.deleted, files.length);
    } catch (error) {
      result.errors.push(`Failed to delete ${file.name}: ${error}`);
    }
  }

  return result;
}

/**
 * Delete files by prefix (folder)
 */
export async function deleteFilesByPrefix(
  storage: admin.storage.Storage,
  prefix: string,
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  const bucket = storage.bucket();
  const [files] = await bucket.getFiles({ prefix });

  const result: CleanupResult = {
    totalProcessed: files.length,
    deleted: 0,
    preserved: 0,
    errors: [],
  };

  for (const file of files) {
    try {
      await file.delete();
      result.deleted++;
      onProgress?.(result.deleted, files.length);
    } catch (error) {
      result.errors.push(`Failed to delete ${file.name}: ${error}`);
    }
  }

  return result;
}

/**
 * Get storage statistics
 */
export async function getStorageStats(
  storage: admin.storage.Storage
): Promise<{
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeMB: number;
}> {
  const files = await listFiles(storage);
  const totalSizeBytes = files.reduce((sum, file) => sum + file.size, 0);

  return {
    totalFiles: files.length,
    totalSizeBytes,
    totalSizeMB: Math.round((totalSizeBytes / (1024 * 1024)) * 100) / 100,
  };
}

/**
 * Delete user files (files in users/{userId}/ folder)
 */
export async function deleteUserFiles(
  storage: admin.storage.Storage,
  userId: string,
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  return deleteFilesByPrefix(storage, `users/${userId}/`, onProgress);
}
