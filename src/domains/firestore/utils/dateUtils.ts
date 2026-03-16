import { Timestamp } from 'firebase/firestore';
import { diffMinutes, diffHours, diffDays } from '../../../shared/domain/utils/calculation.util';

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

/**
 * Labels for relative time formatting.
 * Pass localized strings to support i18n.
 */
export interface RelativeTimeLabels {
  now: string;
  minutes: string;
  hours: string;
  days: string;
}

const DEFAULT_LABELS: RelativeTimeLabels = {
  now: "now",
  minutes: "m",
  hours: "h",
  days: "d",
};

/**
 * Format a Date (or Firestore Timestamp) as a short relative time string.
 * Optimized: Uses centralized calculation utilities
 *
 * Examples: "now", "5m", "2h", "3d", or a localized date for older values.
 *
 * @param date    The date to format (typically from `timestampToDate()` or `Timestamp.toDate()`)
 * @param labels  Optional localized labels — defaults to English abbreviations
 */
export function formatRelativeTime(
  date: Date,
  labels: RelativeTimeLabels = DEFAULT_LABELS,
): string {
  const now = new Date();

  // Use centralized calculation utilities
  const minsAgo = diffMinutes(now, date);
  if (minsAgo < 1) return labels.now;
  if (minsAgo < 60) return `${minsAgo}${labels.minutes}`;

  const hoursAgo = diffHours(now, date);
  if (hoursAgo < 24) return `${hoursAgo}${labels.hours}`;

  const daysAgo = diffDays(now, date);
  if (daysAgo < 7) return `${daysAgo}${labels.days}`;

  return date.toLocaleDateString();
}
