/**
 * Query Modifiers Utility
 * Utilities for applying query modifiers (sort, limit, cursor)
 */

import {
  query,
  orderBy,
  where,
  limit as limitQuery,
  startAfter,
  type Query,
  Timestamp,
} from "firebase/firestore";
import { validateDateRangeOrThrow } from "../validation/date-validator.util";

export interface SortOptions {
  field: string;
  order?: "asc" | "desc";
}

export interface DateRangeOptions {
  field: string;
  startDate?: number;
  endDate?: number;
}

/**
 * Apply date range filters to query
 */
export function applyDateRange(q: Query, dateRange: DateRangeOptions | undefined): Query {
  if (!dateRange) return q;

  // FIX: Validate date range if both dates are provided
  if (dateRange.startDate !== undefined && dateRange.endDate !== undefined) {
    validateDateRangeOrThrow(dateRange.startDate, dateRange.endDate);
  }

  if (dateRange.startDate) {
    q = query(q, where(dateRange.field, ">=", Timestamp.fromMillis(dateRange.startDate)));
  }
  if (dateRange.endDate) {
    q = query(q, where(dateRange.field, "<=", Timestamp.fromMillis(dateRange.endDate)));
  }
  return q;
}

/**
 * Apply sorting to query
 */
export function applySort(q: Query, sort?: SortOptions): Query {
  if (!sort) return q;
  const sortOrder = sort.order || "desc";
  return query(q, orderBy(sort.field, sortOrder));
}

/**
 * Apply cursor for pagination
 */
export function applyCursor(q: Query, cursorValue?: number): Query {
  if (cursorValue === undefined) return q;
  return query(q, startAfter(Timestamp.fromMillis(cursorValue)));
}

/**
 * Apply limit to query
 */
export function applyLimit(q: Query, limitValue?: number): Query {
  if (limitValue === undefined) return q;
  return query(q, limitQuery(limitValue));
}
