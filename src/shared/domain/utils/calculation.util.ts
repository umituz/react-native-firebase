/**
 * Calculation Utilities
 */

export function calculatePercentage(current: number, limit: number): number {
  if (limit <= 0) return 0;
  if (current <= 0) return 0;
  if (current >= limit) return 1;
  return current / limit;
}

export function calculateRemaining(current: number, limit: number): number {
  return Math.max(0, limit - current);
}

export function safeFloor(value: number, min: number): number {
  const floored = Math.floor(value);
  return floored < min ? min : floored;
}

export function diffMs(date1: number | Date, date2: number | Date): number {
  const d1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const d2 = typeof date2 === 'number' ? date2 : date2.getTime();
  return Math.abs(d1 - d2);
}

export function diffMinutes(date1: number | Date, date2: number | Date): number {
  return Math.floor(diffMs(date1, date2) / 60000);
}

export function diffHours(date1: number | Date, date2: number | Date): number {
  return Math.floor(diffMs(date1, date2) / 3600000);
}

export function diffDays(date1: number | Date, date2: number | Date): number {
  return Math.floor(diffMs(date1, date2) / 86400000);
}

export function chunkArray<T>(array: readonly T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize) as T[]);
  }
  return result;
}

export function safeSlice<T>(array: T[], start: number, end?: number): T[] {
  if (start < 0) return array.slice(0, end);
  if (start >= array.length) return [];
  return array.slice(start, end);
}

export function getFetchLimit(pageLimit: number): number {
  return pageLimit + 1;
}

export function hasMore(itemsLength: number, pageLimit: number): boolean {
  return itemsLength > pageLimit;
}

export function getResultCount(itemsLength: number, pageLimit: number): number {
  return Math.min(itemsLength, pageLimit);
}
