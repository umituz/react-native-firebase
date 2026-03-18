/**
 * Where Clause Factory
 * Single Responsibility: Create where clauses
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp } from 'firebase/firestore';
import { WhereClause } from './WhereClause';

/**
 * Create equals where clause
 */
export function equals(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '==', value);
}

/**
 * Create not-equals where clause
 */
export function notEquals(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '!=', value);
}

/**
 * Create less-than where clause
 */
export function lessThan(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '<', value);
}

/**
 * Create less-than-or-equal where clause
 */
export function lessThanOrEqual(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '<=', value);
}

/**
 * Create greater-than where clause
 */
export function greaterThan(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '>', value);
}

/**
 * Create greater-than-or-equal where clause
 */
export function greaterThanOrEqual(field: string, value: unknown): WhereClause {
  return new WhereClause(field, '>=', value);
}

/**
 * Create array-contains where clause
 */
export function arrayContains(field: string, value: unknown): WhereClause {
  return new WhereClause(field, 'array-contains', value);
}

/**
 * Create in where clause
 */
export function inOp(field: string, values: unknown[]): WhereClause {
  return new WhereClause(field, 'in', values);
}

/**
 * Create not-in where clause
 */
export function notIn(field: string, values: unknown[]): WhereClause {
  return new WhereClause(field, 'not-in', values);
}

/**
 * Create array-contains-any where clause
 */
export function arrayContainsAny(field: string, values: unknown[]): WhereClause {
  return new WhereClause(field, 'array-contains-any', values);
}

/**
 * Create where clause with custom operator
 */
export function where(
  field: string,
  operator: WhereFilterOp,
  value: unknown
): WhereClause {
  return new WhereClause(field, operator, value);
}

/**
 * Create where clause from object
 */
export function fromObject(obj: {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}): WhereClause {
  return new WhereClause(obj.field, obj.operator, obj.value);
}
