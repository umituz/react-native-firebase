/**
 * Where Clause Helper Utilities
 * Single Responsibility: Provide helper functions for where clauses
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp } from 'firebase/firestore';
import type { WhereClause } from './WhereClause';
import {
  isEqualityOperator,
  isInequalityOperator,
  isComparisonOperator,
  isArrayOperator,
  isMembershipOperator,
} from './WhereClauseValidation';

/**
 * Get field path as array
 */
export function getFieldPath(clause: WhereClause): string[] {
  return clause.field.split('.');
}

/**
 * Check if field is nested
 */
export function isNestedField(clause: WhereClause): boolean {
  return clause.field.includes('.');
}

/**
 * Get top-level field name
 */
export function getTopLevelField(clause: WhereClause): string {
  const parts = clause.field.split('.');
  return parts[0] || '';
}

/**
 * Get description of where clause
 */
export function getDescription(clause: WhereClause): string {
  return `${clause.field} ${clause.operator} ${JSON.stringify(clause.value)}`;
}

/**
 * Convert where clause to object
 */
export function toObject(clause: WhereClause): {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
} {
  return {
    field: clause.field,
    operator: clause.operator,
    value: clause.value,
  };
}

/**
 * Check if two where clauses are equal
 */
export function whereClausesEqual(a: WhereClause, b: WhereClause): boolean {
  return (
    a.field === b.field &&
    a.operator === b.operator &&
    JSON.stringify(a.value) === JSON.stringify(b.value)
  );
}

/**
 * Check if where clauses are compatible (can be used together)
 */
export function areClausesCompatible(a: WhereClause, b: WhereClause): boolean {
  // Same field with different operators is not allowed
  if (a.field === b.field && a.operator !== b.operator) {
    return false;
  }

  // Inequality operators cannot be combined with other inequality operators on same field
  if (a.field === b.field && isInequalityOperator(a.operator) && isInequalityOperator(b.operator)) {
    return false;
  }

  return true;
}

/**
 * Check if clause is equality type
 */
export function isEqualityClause(clause: WhereClause): boolean {
  return isEqualityOperator(clause.operator);
}

/**
 * Check if clause is inequality type
 */
export function isInequalityClause(clause: WhereClause): boolean {
  return isInequalityOperator(clause.operator);
}

/**
 * Check if clause is comparison type
 */
export function isComparisonClause(clause: WhereClause): boolean {
  return isComparisonOperator(clause.operator);
}

/**
 * Check if clause is array type
 */
export function isArrayClause(clause: WhereClause): boolean {
  return isArrayOperator(clause.operator);
}

/**
 * Check if clause is membership type
 */
export function isMembershipClause(clause: WhereClause): boolean {
  return isMembershipOperator(clause.operator);
}
