import { Timestamp } from 'firebase/firestore';

/**
 * Validate ISO 8601 date string format
 */
function isValidISODate(isoString: string): boolean {
  // Check if it matches ISO 8601 format (basic check)
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?([+-]\d{2}:\d{2})?$/;
  if (!isoPattern.test(isoString)) {
    return false;
  }

  // Verify it's a valid date
  const date = new Date(isoString);
  return !isNaN(date.getTime());
}

/**
 * Convert ISO string to Firestore Timestamp
 * @throws Error if isoString is not a valid ISO 8601 date
 */
export function isoToTimestamp(isoString: string): Timestamp {
  if (!isValidISODate(isoString)) {
    throw new Error(`Invalid ISO date string: ${isoString}`);
  }
  const date = new Date(isoString);
  return Timestamp.fromDate(date);
}

/**
 * Convert Firestore Timestamp to ISO string
 * Returns null if timestamp is null or undefined
 */
export function timestampToISO(timestamp: Timestamp | null | undefined): string | null {
    if (!timestamp) return null;
    return timestamp.toDate().toISOString();
}

/**
 * Convert Firestore Timestamp to Date
 * Returns null if timestamp is null or undefined
 */
export function timestampToDate(timestamp: Timestamp | null | undefined): Date | null {
    if (!timestamp) return null;
    return timestamp.toDate();
}

/**
 * Get current date as ISO string
 */
export function getCurrentISOString(): string {
    return new Date().toISOString();
}
