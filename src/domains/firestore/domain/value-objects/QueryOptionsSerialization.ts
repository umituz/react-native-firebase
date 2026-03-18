/**
 * Query Options Serialization
 * Single Responsibility: Handle serialization and conversion
 *
 * Serialization and conversion utilities for QueryOptions.
 * Separated for better maintainability.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { QueryOptions, createQueryOptions } from './QueryOptions';
import { WhereClause } from './WhereClause';
import type { SortOptions, DateRangeOptions, PaginationOptions } from './QueryOptions';

/**
 * Convert to plain object (for serialization)
 */
export function toObject(options: QueryOptions): {
  where: WhereClause[];
  sort: SortOptions[];
  dateRange: DateRangeOptions | null;
  pagination: PaginationOptions | null;
} {
  return {
    where: [...options.whereClauses],
    sort: [...options.sortOptions],
    dateRange: options.dateRange,
    pagination: options.pagination,
  };
}

/**
 * Create from plain object
 */
export function fromObject(obj: {
  where?: Array<{ field: string; operator: string; value: unknown }>;
  sort?: SortOptions[];
  dateRange?: DateRangeOptions;
  pagination?: PaginationOptions;
}): QueryOptions {
  return QueryOptions.create({
    where: obj.where?.map(w => WhereClause.create(w.field, w.operator as any, w.value)) || [],
    sort: obj.sort || [],
    dateRange: obj.dateRange || null,
    pagination: obj.pagination || null,
  });
}

/**
 * Create from filters object (simplified)
 */
export function fromFilters(filters: Record<string, unknown>): QueryOptions {
  const whereClauses = Object.entries(filters).map(([field, value]) =>
    WhereClause.equals(field, value)
  );

  return QueryOptions.create({ where: whereClauses });
}

/**
 * Merge multiple query options
 */
export function mergeOptions(...options: QueryOptions[]): QueryOptions {
  if (options.length === 0) {
    return createQueryOptions();
  }

  if (options.length === 1) {
    return options[0];
  }

  const merged = options.reduce((acc, opt) => {
    return QueryOptions.create({
      where: [...acc.whereClauses, ...opt.whereClauses] as WhereClause[],
      sort: opt.sortOptions.length > 0 ? [...opt.sortOptions] as any[] : [...acc.sortOptions] as any[],
      dateRange: opt.dateRange ?? acc.dateRange,
      pagination: opt.pagination ?? acc.pagination,
    });
  });

  return merged ?? createQueryOptions();
}

/**
 * Create paginated query options
 */
export function createPaginatedOptions(limit: number, cursor?: number): QueryOptions {
  return createQueryOptions({
    pagination: { limit, cursor },
  });
}

/**
 * Create sorted query options
 */
export function createSortedOptions(
  field: string,
  direction: 'asc' | 'desc' = 'asc'
): QueryOptions {
  return createQueryOptions({
    sort: [{ field, direction }],
  });
}

/**
 * Create date range query options
 */
export function createDateRangeOptions(
  field: string,
  startDate?: Date,
  endDate?: Date
): QueryOptions {
  return createQueryOptions({
    dateRange: { field, startDate, endDate },
  });
}

/**
 * Clone query options with safety checks
 */
export function cloneSafe(options: QueryOptions, defaults?: Partial<{
  where: WhereClause[];
  sort: SortOptions[];
  dateRange: DateRangeOptions;
  pagination: PaginationOptions;
}>): QueryOptions {
  return QueryOptions.create({
    where: options.whereClauses.length > 0 ? [...options.whereClauses] as WhereClause[] : defaults?.where || [],
    sort: options.sortOptions.length > 0 ? [...options.sortOptions] as SortOptions[] : defaults?.sort || [],
    dateRange: options.dateRange ?? defaults?.dateRange ?? null,
    pagination: options.pagination ?? defaults?.pagination ?? null,
  });
}

/**
 * Strip pagination from options
 */
export function withoutPagination(options: QueryOptions): QueryOptions {
  return QueryOptions.create({
    where: [...options.whereClauses] as WhereClause[],
    sort: [...options.sortOptions] as SortOptions[],
    dateRange: options.dateRange,
    pagination: null,
  });
}

/**
 * Strip sort from options
 */
export function withoutSort(options: QueryOptions): QueryOptions {
  return QueryOptions.create({
    where: [...options.whereClauses] as WhereClause[],
    sort: [],
    dateRange: options.dateRange,
    pagination: options.pagination,
  });
}

/**
 * Strip date range from options
 */
export function withoutDateRange(options: QueryOptions): QueryOptions {
  return QueryOptions.create({
    where: [...options.whereClauses] as WhereClause[],
    sort: [...options.sortOptions] as SortOptions[],
    dateRange: null,
    pagination: options.pagination,
  });
}

/**
 * Strip where clauses from options
 */
export function withoutWhere(options: QueryOptions): QueryOptions {
  return QueryOptions.create({
    where: [],
    sort: [...options.sortOptions] as SortOptions[],
    dateRange: options.dateRange,
    pagination: options.pagination,
  });
}

/**
 * Add limit to existing options
 */
export function withLimit(options: QueryOptions, limit: number): QueryOptions {
  const currentPagination = options.pagination || {};
  return QueryOptions.create({
    where: [...options.whereClauses] as WhereClause[],
    sort: [...options.sortOptions] as SortOptions[],
    dateRange: options.dateRange,
    pagination: { ...currentPagination, limit },
  });
}

/**
 * Add cursor to existing options
 */
export function withCursor(options: QueryOptions, cursor: number): QueryOptions {
  const currentPagination = options.pagination || {};
  return QueryOptions.create({
    where: [...options.whereClauses] as WhereClause[],
    sort: [...options.sortOptions] as SortOptions[],
    dateRange: options.dateRange,
    pagination: { ...currentPagination, cursor },
  });
}
