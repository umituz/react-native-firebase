/**
 * Query Options Helpers
 * Single Responsibility: Provide helper functions for query options
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { QueryOptions } from './QueryOptions';
import type { SortOptions, DateRangeOptions, PaginationOptions } from './QueryOptions';

/**
 * Check if query options has where clauses
 */
export function hasWhereClauses(options: QueryOptions): boolean {
  return options.whereClauses.length > 0;
}

/**
 * Check if query options has sort options
 */
export function hasSortOptions(options: QueryOptions): boolean {
  return options.sortOptions.length > 0;
}

/**
 * Check if query options has date range
 */
export function hasDateRange(options: QueryOptions): boolean {
  return options.dateRange !== null;
}

/**
 * Check if query options has pagination
 */
export function hasPagination(options: QueryOptions): boolean {
  return options.pagination !== null;
}

/**
 * Check if query options is empty
 */
export function isEmpty(options: QueryOptions): boolean {
  return (
    options.whereClauses.length === 0 &&
    options.sortOptions.length === 0 &&
    options.dateRange === null &&
    options.pagination === null
  );
}

/**
 * Get where clause count
 */
export function getWhereClauseCount(options: QueryOptions): number {
  return options.whereClauses.length;
}

/**
 * Get sort option count
 */
export function getSortOptionCount(options: QueryOptions): number {
  return options.sortOptions.length;
}

/**
 * Get first sort option
 */
export function getFirstSortOption(options: QueryOptions): SortOptions | null {
  return options.sortOptions.length > 0 ? options.sortOptions[0] || null : null;
}

/**
 * Check if query has limit
 */
export function hasLimit(options: QueryOptions): boolean {
  return options.pagination !== null && options.pagination.limit !== undefined;
}

/**
 * Get limit value
 */
export function getLimit(options: QueryOptions): number | null {
  return options.pagination?.limit || null;
}

/**
 * Get cursor value
 */
export function getCursor(options: QueryOptions): number | null {
  return options.pagination?.cursor || null;
}

/**
 * Convert query options to summary object
 */
export function toSummary(options: QueryOptions): {
  whereCount: number;
  sortCount: number;
  hasDateRange: boolean;
  hasPagination: boolean;
  limit: number | null;
} {
  return {
    whereCount: options.whereClauses.length,
    sortCount: options.sortOptions.length,
    hasDateRange: options.dateRange !== null,
    hasPagination: options.pagination !== null,
    limit: options.pagination?.limit || null,
  };
}
