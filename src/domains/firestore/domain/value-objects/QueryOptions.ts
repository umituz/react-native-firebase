/**
 * Query Options Value Object (Main)
 * Single Responsibility: Encapsulate query configuration options
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp, OrderByDirection } from 'firebase/firestore';
import { WhereClause } from './WhereClause';
import * as Factory from './QueryOptionsFactory';

export interface SortOptions {
  readonly field: string;
  readonly direction: OrderByDirection;
}

export interface DateRangeOptions {
  readonly field: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
}

export interface PaginationOptions {
  readonly cursor?: number;
  readonly limit?: number;
  readonly startAfter?: number;
  readonly startAt?: number;
}

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

  static empty(): QueryOptions {
    return new QueryOptions([], [], null, null);
  }

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

  withWhere(clause: WhereClause): QueryOptions {
    return new QueryOptions(
      [...this.whereClauses, clause] as WhereClause[],
      [...this.sortOptions] as SortOptions[],
      this.dateRange,
      this.pagination
    );
  }

  withSort(sort: SortOptions): QueryOptions {
    return new QueryOptions(
      [...this.whereClauses] as WhereClause[],
      [...this.sortOptions, sort] as SortOptions[],
      this.dateRange,
      this.pagination
    );
  }

  withDateRange(dateRange: DateRangeOptions): QueryOptions {
    return new QueryOptions(
      [...this.whereClauses] as WhereClause[],
      [...this.sortOptions] as SortOptions[],
      dateRange,
      this.pagination
    );
  }

  withPagination(pagination: PaginationOptions): QueryOptions {
    return new QueryOptions(
      [...this.whereClauses] as WhereClause[],
      [...this.sortOptions] as SortOptions[],
      this.dateRange,
      pagination
    );
  }

  withLimit(limit: number): QueryOptions {
    return this.withPagination({
      ...this.pagination,
      limit,
    } as PaginationOptions);
  }

  clearWhere(): QueryOptions {
    return new QueryOptions([], [...this.sortOptions] as SortOptions[], this.dateRange, this.pagination);
  }

  clearSort(): QueryOptions {
    return new QueryOptions([...this.whereClauses] as WhereClause[], [], this.dateRange, this.pagination);
  }

  clearDateRange(): QueryOptions {
    return new QueryOptions([...this.whereClauses] as WhereClause[], [...this.sortOptions] as SortOptions[], null, this.pagination);
  }

  clearPagination(): QueryOptions {
    return new QueryOptions([...this.whereClauses] as WhereClause[], [...this.sortOptions] as SortOptions[], this.dateRange, null);
  }

  clone(modifications: {
    where?: WhereClause[];
    sort?: SortOptions[];
    dateRange?: DateRangeOptions | null;
    pagination?: PaginationOptions | null;
  }): QueryOptions {
    return Factory.clone(this, modifications);
  }
}

// Factory function
export function createQueryOptions(options?: {
  where?: WhereClause[];
  sort?: SortOptions[];
  dateRange?: DateRangeOptions;
  pagination?: PaginationOptions;
}): QueryOptions {
  return options ? QueryOptions.create(options) : QueryOptions.empty();
}
