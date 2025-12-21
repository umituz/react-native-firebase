import { Timestamp } from 'firebase/firestore';

/**
 * Convert ISO string to Firestore Timestamp
 */
export function isoToTimestamp(isoString: string): Timestamp {
    return Timestamp.fromDate(new Date(isoString));
}

/**
 * Convert Firestore Timestamp to ISO string
 */
export function timestampToISO(timestamp: Timestamp): string {
    if (!timestamp) return new Date().toISOString();
    return timestamp.toDate().toISOString();
}

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp): Date {
    if (!timestamp) return new Date();
    return timestamp.toDate();
}

/**
 * Get current date as ISO string
 */
export function getCurrentISOString(): string {
    return new Date().toISOString();
}
