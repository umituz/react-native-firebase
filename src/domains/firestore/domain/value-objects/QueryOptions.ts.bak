/**
 * Query Options Value Object (Main)
 * Single Responsibility: Encapsulate query configuration options
 *
 * Value object that represents query options in a type-safe way.
 * Provides validation and business logic for query configuration.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp, OrderByDirection } from 'firebase/firestore';
import { WhereClause } from './WhereClause';

/**
 * Sort options
 */
export interface SortOptions {
  readonly field: string;
  readonly direction: OrderByDirection;
}

/**
 * Date range options
 */
export interface DateRangeOptions {
  readonly field: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  readonly cursor?: number;
  readonly limit?: number;
  readonly startAfter?: number;
  readonly startAt?: number;
}

/**
 * Query options value object
 * Immutable configuration for Firestore queries
 */
export class QueryOptions {
  readonly whereClauses: readonly WhereClause[];
  readonly sortOptions: readonly SortOptions[];
  readonly dateRange: DateRangeOptions | null;
  readonly pagination: PaginationOptions | null;

  private constructor(
    whereClauses: WhereClause[],
    sortOptions: SortOptions[],
    dateRange: DateRangeOptions | null,
    pagination: PaginationOptions | null
  ) {
    this.whereClauses = Object.freeze(whereClauses);
    this.sortOptions = Object.freeze(sortOptions);
    this.dateRange = dateRange ? Object.freeze(dateRange) : null;
    this.pagination = pagination ? Object.freeze(pagination) : null;
  }

  /**
   * Create empty query options
   */
  static empty(): QueryOptions {
    return new QueryOptions([], [], null, null);
  }

  /**
   * Create query options from partial configuration
   */
  static create(options: {
    where?: WhereClause[];
    sort?: SortOptions[];
    dateRange?: DateRangeOptions;
    pagination?: PaginationOptions;
  }): QueryOptions {
    return new QueryOptions(
      options.where || [],
      options.sort || [],
      options.dateRange || null,
      options.pagination || null
    );
  }

  /**
   * Add where clause
   */
  withWhere(clause: WhereClause): QueryOptions {
    return new QueryOptions(
      [...this.whereClauses, clause] as WhereClause[],
      this.sortOptions,
      this.dateRange,
      this.pagination
    );
  }

  /**
   * Add sort option
   */
  withSort(sort: SortOptions): QueryOptions {
    return new QueryOptions(
      this.whereClauses,
      [...this.sortOptions, sort] as SortOptions[],
      this.dateRange,
      this.pagination
    );
  }

  /**
   * Set date range
   */
  withDateRange(dateRange: DateRangeOptions): QueryOptions {
    return new QueryOptions(
      this.whereClauses,
      this.sortOptions,
      dateRange,
      this.pagination
    );
  }

  /**
   * Set pagination
   */
  withPagination(pagination: PaginationOptions): QueryOptions {
    return new QueryOptions(
      this.whereClauses,
      this.sortOptions,
      this.dateRange,
      pagination
    );
  }

  /**
   * Remove all where clauses
   */
  clearWhere(): QueryOptions {
    return new QueryOptions([], this.sortOptions, this.dateRange, this.pagination);
  }

  /**
   * Remove all sort options
   */
  clearSort(): QueryOptions {
    return new QueryOptions(this.whereClauses, [], this.dateRange, this.pagination);
  }

  /**
   * Remove date range
   */
  clearDateRange(): QueryOptions {
    return new QueryOptions(this.whereClauses, this.sortOptions, null, this.pagination);
  }

  /**
   * Remove pagination
   */
  clearPagination(): QueryOptions {
    return new QueryOptions(this.whereClauses, this.sortOptions, this.dateRange, null);
  }

  /**
   * Clone with modifications
   */
  clone(modifications: {
    where?: WhereClause[];
    sort?: SortOptions[];
    dateRange?: DateRangeOptions | null;
    pagination?: PaginationOptions | null;
  }): QueryOptions {
    return QueryOptions.create({
      where: modifications.where ?? [...this.whereClauses] as WhereClause[],
      sort: modifications.sort ?? [...this.sortOptions] as SortOptions[],
      dateRange: modifications.dateRange ?? this.dateRange ?? null,
      pagination: modifications.pagination ?? this.pagination ?? null,
    });
  }
}

/**
 * Factory function to create query options
 */
export function createQueryOptions(options?: {
  where?: WhereClause[];
  sort?: SortOptions[];
  dateRange?: DateRangeOptions;
  pagination?: PaginationOptions;
}): QueryOptions {
  return options ? QueryOptions.create(options) : QueryOptions.empty();
}
