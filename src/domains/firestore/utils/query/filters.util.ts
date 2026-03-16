/**
 * Query Filters Utility
 * Utilities for creating Firestore field filters
 * Optimized: Uses centralized calculation utilities
 */

import {
  query,
  where,
  or,
  type WhereFilterOp,
  type Query,
} from "firebase/firestore";

/**
 * Chunk array into smaller arrays (local copy for this module)
 * Inlined here to avoid circular dependencies
 */
function chunkArray(array: readonly (string | number)[], chunkSize: number): (string | number)[][] {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than 0');
  }

  const chunks: (string | number)[][] = [];
  const len = array.length;

  for (let i = 0; i < len; i += chunkSize) {
    const end = Math.min(i + chunkSize, len);
    chunks.push(array.slice(i, end));
  }

  return chunks;
}

export interface FieldFilter {
  field: string;
  operator: WhereFilterOp;
  value: string | number | boolean | string[] | number[];
}

const MAX_IN_OPERATOR_VALUES = 10;

/**
 * Apply field filter with 'in' operator and chunking support
 * Optimized: Uses centralized chunkArray utility
 */
export function applyFieldFilter(q: Query, filter: FieldFilter): Query {
  const { field, operator, value } = filter;

  if (operator === "in" && Array.isArray(value)) {
    if (value.length <= MAX_IN_OPERATOR_VALUES) {
      return query(q, where(field, "in", value));
    }

    // Split into chunks of 10 and use 'or' operator
    // Optimized: Uses local chunkArray utility
    const chunks = chunkArray(value, MAX_IN_OPERATOR_VALUES);
    const orConditions = chunks.map((chunk) => where(field, "in", chunk));
    return query(q, or(...orConditions));
  }

  return query(q, where(field, operator, value));
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

