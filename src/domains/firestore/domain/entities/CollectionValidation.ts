/**
 * Collection Validation Utilities
 * Single Responsibility: Validate collection names and paths
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { Collection } from './Collection';

/**
 * Validate collection name format
 */
export function isValidCollectionName(name: string): boolean {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return false;
  }

  const invalidChars = /[\/\\.\s]/;
  if (invalidChars.test(name)) {
    return false;
  }

  if (name.startsWith('__') || name.endsWith('__')) {
    return false;
  }

  if (name.length > 100) {
    return false;
  }

  return true;
}

/**
 * Check if collection is valid
 */
export function isValidCollection(collection: Collection): boolean {
  return isValidCollectionName(collection.getName()) &&
         isValidCollectionPath(collection.getPath());
}

/**
 * Validate collection path format
 */
export function isValidCollectionPath(path: string): boolean {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return false;
  }

  const segments = path.split('/');
  if (segments.length < 1 || segments.length % 2 === 0) {
    return false;
  }

  return segments.every(segment => isValidCollectionName(segment));
}

/**
 * Extract collection name from path
 */
export function extractCollectionNameFromPath(path: string): string | null {
  if (!isValidCollectionPath(path)) {
    return null;
  }

  const segments = path.split('/');
  return segments[segments.length - 1] || null;
}

/**
 * Extract parent path from collection path
 */
export function extractParentCollectionPath(path: string): string | null {
  if (!isValidCollectionPath(path)) {
    return null;
  }

  const segments = path.split('/');
  if (segments.length <= 1) {
    return null;
  }

  const result = segments.slice(0, -1).join('/');
  return result || null;
}

/**
 * Check if path points to document
 */
export function isDocumentPath(path: string): boolean {
  const segments = path.split('/');
  return segments.length % 2 === 0 && segments.length >= 2;
}

/**
 * Check if path points to collection
 */
export function isCollectionPath(path: string): boolean {
  const segments = path.split('/');
  return segments.length % 2 !== 0 && segments.length >= 1;
}

/**
 * Check if collection is a user collection (users/{userId}/{collection})
 */
export function isUserCollectionPath(path: string): boolean {
  return path.startsWith('users/');
}

/**
 * Extract user ID from user collection path
 */
export function extractUserIdFromPath(path: string): string | null {
  if (!isUserCollectionPath(path)) return null;

  const segments = path.split('/');
  if (segments.length >= 3 && segments[0] === 'users') {
    const userId = segments[1];
    return userId || null;
  }

  return null;
}

/**
 * Create a sub-collection path
 */
export function createSubCollectionPath(parentPath: string, subCollectionName: string): string | null {
  if (!isValidCollectionPath(parentPath)) {
    return null;
  }

  if (!isValidCollectionName(subCollectionName)) {
    return null;
  }

  return `${parentPath}/${subCollectionName}`;
}
