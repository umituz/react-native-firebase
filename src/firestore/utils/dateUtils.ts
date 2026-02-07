import { Timestamp } from 'firebase/firestore';

/**
 * Convert ISO string to Firestore Timestamp
 */
export function isoToTimestamp(isoString: string): Timestamp {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid ISO date string: ${isoString}`);
    }
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
