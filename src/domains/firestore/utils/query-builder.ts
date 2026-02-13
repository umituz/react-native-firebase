/**
 * Query Builder Utility
 * Single Responsibility: Build Firestore queries with advanced filtering
 */

import {
  collection,
  type Firestore,
  type Query,
} from "firebase/firestore";
import { applyFieldFilter, createInFilter, createEqualFilter, createFieldFilter, type FieldFilter } from "./query/filters.util";
import { applyDateRange, applySort, applyCursor, applyLimit, type SortOptions, type DateRangeOptions } from "./query/modifiers.util";

export interface QueryBuilderOptions {
  collectionName: string;
  baseFilters?: FieldFilter[];
  dateRange?: DateRangeOptions;
  sort?: SortOptions;
  limitValue?: number;
  cursorValue?: number;
}

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

  for (const filter of baseFilters) {
    q = applyFieldFilter(q, filter);
  }

  q = applyDateRange(q, dateRange);
  q = applySort(q, sort);
  q = applyCursor(q, cursorValue);
  q = applyLimit(q, limitValue);

  return q;
}

export { createInFilter, createEqualFilter, createFieldFilter };
export type { FieldFilter, SortOptions, DateRangeOptions };
