/**
 * Query Options Factory
 * Single Responsibility: Create query options
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp, OrderByDirection } from 'firebase/firestore';
import type { SortOptions, DateRangeOptions, PaginationOptions } from './QueryOptions';
import { WhereClause } from './WhereClause';
import { QueryOptions } from './QueryOptions';

/**
 * Create empty query options
 */
export function empty(): QueryOptions {
  return QueryOptions.empty();
}

/**
 * Create query options from partial configuration
 */
export function create(options: {
  where?: WhereClause[];
  sort?: SortOptions[];
  dateRange?: DateRangeOptions;
  pagination?: PaginationOptions;
}): QueryOptions {
  return QueryOptions.create(options);
}

/**
 * Create query options with where clause
 */
export function withWhere(
  baseOptions: QueryOptions,
  field: string,
  operator: WhereFilterOp,
  value: unknown
): QueryOptions {
  const clause = new WhereClause(field, operator, value);
  return baseOptions.withWhere(clause);
}

/**
 * Create query options with sort
 */
export function withSort(
  baseOptions: QueryOptions,
  field: string,
  direction: OrderByDirection
): QueryOptions {
  return baseOptions.withSort({ field, direction });
}

/**
 * Create query options with date range
 */
export function withDateRange(
  baseOptions: QueryOptions,
  field: string,
  startDate?: Date,
  endDate?: Date
): QueryOptions {
  return baseOptions.withDateRange({ field, startDate, endDate });
}

/**
 * Create query options with pagination
 */
export function withPagination(
  baseOptions: QueryOptions,
  pagination: PaginationOptions
): QueryOptions {
  return baseOptions.withPagination(pagination);
}

/**
 * Create query options with limit
 */
export function withLimit(baseOptions: QueryOptions, limit: number): QueryOptions {
  return baseOptions.withLimit(limit);
}

/**
 * Clone query options with modifications
 */
export function clone(baseOptions: QueryOptions, modifications: {
  where?: WhereClause[];
  sort?: SortOptions[];
  dateRange?: DateRangeOptions | null;
  pagination?: PaginationOptions | null;
}): QueryOptions {
  return baseOptions.clone(modifications);
}
