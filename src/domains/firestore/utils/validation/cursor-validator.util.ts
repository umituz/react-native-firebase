/**
 * Cursor Validation Utility
 * Validates pagination cursors for Firestore queries
 */

import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';

const MAX_CURSOR_LENGTH = 1500; // Firestore document ID max length

/**
 * Validates a pagination cursor
 * @param cursor - The cursor to validate
 * @returns true if cursor is valid, false otherwise
 */
export function isValidCursor(cursor: string | undefined | null): boolean {
  // undefined/null is valid (first page)
  if (cursor === undefined || cursor === null) {
    return true;
  }

  // Must be string
  if (typeof cursor !== 'string') {
    return false;
  }

  // Empty string invalid
  if (cursor.length === 0) {
    return false;
  }

  // No leading/trailing whitespace
  if (cursor.trim() !== cursor) {
    return false;
  }

  // Length check (Firestore doc ID max)
  if (cursor.length > MAX_CURSOR_LENGTH) {
    return false;
  }

  // No null bytes (Firestore forbidden)
  if (cursor.includes('\0')) {
    return false;
  }

  // No path separators (invalid in cursor)
  if (cursor.includes('/')) {
    return false;
  }

  return true;
}

/**
 * Cursor validation error class
 */
export class CursorValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CursorValidationError';
  }
}

/**
 * Validates cursor or throws an error
 * @param cursor - The cursor to validate
 * @throws {CursorValidationError} If cursor is invalid
 */
export function validateCursorOrThrow(cursor: string | undefined | null): void {
  if (!isValidCursor(cursor)) {
    throw new CursorValidationError(ERROR_MESSAGES.FIRESTORE.INVALID_CURSOR);
  }
}
