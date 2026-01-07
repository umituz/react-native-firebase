/**
 * Query Builder Utility
 * Single Responsibility: Build Firestore queries with advanced filtering
 */

import {
  collection,
  query,
  where,
  orderBy,
  limit as limitQuery,
  startAfter,
  or,
  type Firestore,
  type Query,
  Timestamp,
  type WhereFilterOp,
} from "firebase/firestore";

export interface FieldFilter {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | string[] | number[];
}

export interface QueryBuilderOptions {
  collectionName: string;
  baseFilters?: FieldFilter[];
  dateRange?: {
    field: string;
    startDate?: number;
    endDate?: number;
  };
  sort?: {
    field: string;
    order?: "asc" | "desc";
  };
  limitValue?: number;
  cursorValue?: number;
}

const MAX_IN_OPERATOR_VALUES = 10;

/**
 * Apply date range filters to query
 */
function applyDateRange(q: Query, dateRange: QueryBuilderOptions['dateRange']): Query {
  if (!dateRange) return q;

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
function applySort(q: Query, sort?: QueryBuilderOptions['sort']): Query {
  if (!sort) return q;
  const sortOrder = sort.order || "desc";
  return query(q, orderBy(sort.field, sortOrder));
}

/**
 * Apply cursor for pagination
 */
function applyCursor(q: Query, cursorValue?: number): Query {
  if (cursorValue === undefined) return q;
  return query(q, startAfter(Timestamp.fromMillis(cursorValue)));
}

/**
 * Apply limit to query
 */
function applyLimit(q: Query, limitValue?: number): Query {
  if (limitValue === undefined) return q;
  return query(q, limitQuery(limitValue));
}

/**
 * Apply field filter with 'in' operator and chunking support
 */
function applyFieldFilter(q: Query, filter: FieldFilter): Query {
  const { field, operator, value } = filter;

  if (operator === "in" && Array.isArray(value)) {
    if (value.length <= MAX_IN_OPERATOR_VALUES) {
      return query(q, where(field, "in", value));
    }

    // Split into chunks of 10 and use 'or' operator
    const chunks: (string[] | number[])[] = [];
    for (let i = 0; i < value.length; i += MAX_IN_OPERATOR_VALUES) {
      chunks.push(value.slice(i, i + MAX_IN_OPERATOR_VALUES));
    }

    const orConditions = chunks.map((chunk) => where(field, "in", chunk));
    return query(q, or(...orConditions));
  }

  return query(q, where(field, operator, value));
}

/**
 * Build Firestore query with advanced filtering support
 */
export function buildQuery(
  db: Firestore,
  options: QueryBuilderOptions,
): Query {
  const {
    collectionName,
    baseFilters = [],
    dateRange,
    sort,
    limitValue,
    cursorValue,
  } = options;

  const collectionRef = collection(db, collectionName);
  let q: Query = collectionRef;

  // Apply base filters
  for (const filter of baseFilters) {
    q = applyFieldFilter(q, filter);
  }

  // Apply modifiers in correct order
  q = applyDateRange(q, dateRange);
  q = applySort(q, sort);
  q = applyCursor(q, cursorValue);
  q = applyLimit(q, limitValue);

  return q;
}

/**
 * Create a field filter for 'in' operator
 */
export function createInFilter(
  field: string,
  values: string[] | number[],
): FieldFilter {
  return { field, operator: "in", value: values };
}

/**
 * Create a field filter for equality
 */
export function createEqualFilter(
  field: string,
  value: string | number | boolean,
): FieldFilter {
  return { field, operator: "==", value };
}
