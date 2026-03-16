/**
 * Calculation Utilities
 * Common mathematical operations used across the codebase
 * Optimized for performance with minimal allocations
 */

/**
 * Safely calculates percentage (0-1 range)
 * Optimized: Guards against division by zero
 *
 * @param current - Current value
 * @param limit - Maximum value
 * @returns Percentage between 0 and 1
 *
 * @example
 * ```typescript
 * const percentage = calculatePercentage(750, 1000); // 0.75
 * const percentage = calculatePercentage(1200, 1000); // 1.0 (capped)
 * const percentage = calculatePercentage(0, 1000); // 0.0
 * ```
 */
export function calculatePercentage(current: number, limit: number): number {
  if (limit <= 0) return 0;
  if (current <= 0) return 0;
  if (current >= limit) return 1;
  return current / limit;
}

/**
 * Calculates remaining quota
 * Optimized: Single Math.max call
 *
 * @param current - Current usage
 * @param limit - Maximum limit
 * @returns Remaining amount (minimum 0)
 *
 * @example
 * ```typescript
 * const remaining = calculateRemaining(250, 1000); // 750
 * const remaining = calculateRemaining(1200, 1000); // 0 (capped)
 * ```
 */
export function calculateRemaining(current: number, limit: number): number {
  return Math.max(0, limit - current);
}

/**
 * Safe floor with minimum value
 * Optimized: Single comparison
 *
 * @param value - Value to floor
 * @param min - Minimum allowed value
 * @returns Floored value, at least min
 *
 * @example
 * ```typescript
 * const result = safeFloor(5.7, 1); // 5
 * const result = safeFloor(0.3, 1); // 1 (min enforced)
 * const result = safeFloor(-2.5, 0); // 0 (min enforced)
 * ```
 */
export function safeFloor(value: number, min: number): number {
  const floored = Math.floor(value);
  return floored < min ? min : floored;
}

/**
 * Safe ceil with maximum value
 * Optimized: Single comparison
 *
 * @param value - Value to ceil
 * @param max - Maximum allowed value
 * @returns Ceiled value, at most max
 *
 * @example
 * ```typescript
 * const result = safeCeil(5.2, 10); // 6
 * const result = safeCeil(9.8, 10); // 10 (max enforced)
 * const result = safeCeil(12.1, 10); // 10 (max enforced)
 * ```
 */
export function safeCeil(value: number, max: number): number {
  const ceiled = Math.ceil(value);
  return ceiled > max ? max : ceiled;
}

/**
 * Clamp value between min and max
 * Optimized: Efficient without branching
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * const result = clamp(5, 0, 10); // 5
 * const result = clamp(-5, 0, 10); // 0
 * const result = clamp(15, 0, 10); // 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Calculate milliseconds between two dates
 * Optimized: Direct subtraction without Date object creation
 *
 * @param date1 - First date (timestamp or Date)
 * @param date2 - Second date (timestamp or Date)
 * @returns Difference in milliseconds (date1 - date2)
 *
 * @example
 * ```typescript
 * const diff = diffMs(Date.now(), Date.now() - 3600000); // 3600000
 * ```
 */
export function diffMs(date1: number | Date, date2: number | Date): number {
  const ms1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const ms2 = typeof date2 === 'number' ? date2 : date2.getTime();
  return ms1 - ms2;
}

/**
 * Calculate minutes difference between two dates
 * Optimized: Single Math.floor call
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in minutes (floored)
 *
 * @example
 * ```typescript
 * const diff = diffMinutes(Date.now(), Date.now() - 180000); // 3
 * ```
 */
export function diffMinutes(date1: number | Date, date2: number | Date): number {
  const msDiff = diffMs(date1, date2);
  return Math.floor(msDiff / 60_000);
}

/**
 * Calculate hours difference between two dates
 * Optimized: Single Math.floor call
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in hours (floored)
 *
 * @example
 * ```typescript
 * const diff = diffHours(Date.now(), Date.now() - 7200000); // 2
 * ```
 */
export function diffHours(date1: number | Date, date2: number | Date): number {
  const minsDiff = diffMinutes(date1, date2);
  return Math.floor(minsDiff / 60);
}

/**
 * Calculate days difference between two dates
 * Optimized: Single Math.floor call
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days (floored)
 *
 * @example
 * ```typescript
 * const diff = diffDays(Date.now(), Date.now() - 172800000); // 2
 * ```
 */
export function diffDays(date1: number | Date, date2: number | Date): number {
  const hoursDiff = diffHours(date1, date2);
  return Math.floor(hoursDiff / 24);
}

/**
 * Safe array slice with bounds checking
 * Optimized: Prevents negative indices and out-of-bounds
 *
 * @param array - Array to slice
 * @param start - Start index (inclusive)
 * @param end - End index (exclusive)
 * @returns Sliced array
 *
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4, 5];
 * const sliced = safeSlice(items, 1, 3); // [2, 3]
 * const sliced = safeSlice(items, -5, 10); // [1, 2, 3, 4, 5] (bounds checked)
 * ```
 */
export function safeSlice<T>(array: T[], start: number, end?: number): T[] {
  const len = array.length;

  // Clamp start index
  const safeStart = start < 0 ? 0 : (start >= len ? len : start);

  // Clamp end index
  const safeEnd = end === undefined
    ? len
    : (end < 0 ? 0 : (end >= len ? len : end));

  // Only slice if valid range
  if (safeStart >= safeEnd) {
    return [];
  }

  return array.slice(safeStart, safeEnd);
}

/**
 * Calculate fetch limit for pagination (pageLimit + 1)
 * Optimized: Simple addition
 *
 * @param pageLimit - Requested page size
 * @returns Fetch limit (pageLimit + 1 for hasMore detection)
 *
 * @example
 * ```typescript
 * const fetchLimit = getFetchLimit(10); // 11
 * ```
 */
export function getFetchLimit(pageLimit: number): number {
  return pageLimit + 1;
}

/**
 * Calculate if hasMore based on items length and page limit
 * Optimized: Direct comparison
 *
 * @param itemsLength - Total items fetched
 * @param pageLimit - Requested page size
 * @returns true if there are more items
 *
 * @example
 * ```typescript
 * const hasMore = hasMore(11, 10); // true
 * const hasMore = hasMore(10, 10); // false
 * ```
 */
export function hasMore(itemsLength: number, pageLimit: number): boolean {
  return itemsLength > pageLimit;
}

/**
 * Calculate result items count (min of itemsLength and pageLimit)
 * Optimized: Single Math.min call
 *
 * @param itemsLength - Total items fetched
 * @param pageLimit - Requested page size
 * @returns Number of items to return
 *
 * @example
 * ```typescript
 * const count = getResultCount(11, 10); // 10
 * const count = getResultCount(8, 10); // 8
 * ```
 */
export function getResultCount(itemsLength: number, pageLimit: number): number {
  return Math.min(itemsLength, pageLimit);
}

/**
 * Chunk array into smaller arrays
 * Optimized: Pre-allocated chunks when size is known
 *
 * @param array - Array to chunk
 * @param chunkSize - Size of each chunk
 * @returns Array of chunks
 *
 * @example
 * ```typescript
 * const chunks = chunkArray([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunkArray<T>(array: readonly T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than 0');
  }

  const chunks: T[][] = [];
  const len = array.length;

  for (let i = 0; i < len; i += chunkSize) {
    const end = Math.min(i + chunkSize, len);
    chunks.push(array.slice(i, end) as T[]);
  }

  return chunks;
}

/**
 * Sum array of numbers
 * Optimized: Direct for-loop (faster than reduce)
 *
 * @param numbers - Array of numbers to sum
 * @returns Sum of all numbers
 *
 * @example
 * ```typescript
 * const sum = sumArray([1, 2, 3, 4, 5]); // 15
 * ```
 */
export function sumArray(numbers: number[]): number {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    if (num !== undefined && num !== null) {
      sum += num;
    }
  }
  return sum;
}

/**
 * Average of array of numbers
 * Optimized: Single-pass calculation
 *
 * @param numbers - Array of numbers
 * @returns Average value
 *
 * @example
 * ```typescript
 * const avg = averageArray([1, 2, 3, 4, 5]); // 3
 * ```
 */
export function averageArray(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sumArray(numbers) / numbers.length;
}

/**
 * Round to decimal places
 * Optimized: Efficient rounding without string conversion
 *
 * @param value - Value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 *
 * @example
 * ```typescript
 * const rounded = roundToDecimals(3.14159, 2); // 3.14
 * ```
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
