/**
 * Where Clause Validation Utilities
 * Single Responsibility: Validate where clauses
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp } from 'firebase/firestore';
import type { WhereClause } from './WhereClause';

/**
 * Validate where clause
 */
export function validateWhereClause(clause: WhereClause): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Field validation
  if (!clause.field || clause.field.trim() === '') {
    errors.push('Field cannot be empty');
  }

  // Value validation
  if (clause.value === undefined) {
    errors.push('Value cannot be undefined');
  }

  // Operator-specific validation
  if (requiresArrayValue(clause.operator)) {
    if (!Array.isArray(clause.value)) {
      errors.push(`Operator '${clause.operator}' requires an array value`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if operator requires array value
 */
export function requiresArrayValue(operator: WhereFilterOp): boolean {
  return operator === 'in' || operator === 'not-in' || operator === 'array-contains-any';
}

/**
 * Check if operator is equality type
 */
export function isEqualityOperator(operator: WhereFilterOp): boolean {
  return operator === '==';
}

/**
 * Check if operator is inequality type
 */
export function isInequalityOperator(operator: WhereFilterOp): boolean {
  return operator === '!=';
}

/**
 * Check if operator is comparison type
 */
export function isComparisonOperator(operator: WhereFilterOp): boolean {
  return ['<', '<=', '>', '>='].includes(operator);
}

/**
 * Check if operator is array type
 */
export function isArrayOperator(operator: WhereFilterOp): boolean {
  return operator === 'array-contains' || operator === 'array-contains-any';
}

/**
 * Check if operator is membership type
 */
export function isMembershipOperator(operator: WhereFilterOp): boolean {
  return operator === 'in' || operator === 'not-in';
}
