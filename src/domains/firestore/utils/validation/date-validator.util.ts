/**
 * Date Range Validation Utility
 * Validates date ranges for Firestore queries
 */

import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';

/**
 * Validates a date range
 * @param start - Start date (Date object or timestamp)
 * @param end - End date (Date object or timestamp)
 * @returns true if range is valid (start <= end), false otherwise
 */
export function isValidDateRange(start: Date | number, end: Date | number): boolean {
  const startTime = start instanceof Date ? start.getTime() : start;
  const endTime = end instanceof Date ? end.getTime() : end;

  if (isNaN(startTime) || isNaN(endTime)) {
    return false;
  }

  return startTime <= endTime;
}

/**
 * Validates date range or throws an error
 * @param start - Start date (Date object or timestamp)
 * @param end - End date (Date object or timestamp)
 * @throws {Error} If range is invalid
 */
export function validateDateRangeOrThrow(start: Date | number, end: Date | number): void {
  if (!isValidDateRange(start, end)) {
    throw new Error(ERROR_MESSAGES.FIRESTORE.INVALID_DATE_RANGE);
  }
}
