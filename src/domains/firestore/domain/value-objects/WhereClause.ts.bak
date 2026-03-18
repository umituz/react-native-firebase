/**
 * Where Clause Value Object
 * Single Responsibility: Encapsulate where clause conditions
 *
 * Value object that represents a single where clause condition.
 * Provides validation and business logic for query filtering.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp } from 'firebase/firestore';

/**
 * Valid where operators for Firestore queries
 */
export type WhereOperator =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';

/**
 * Where clause value object
 * Immutable representation of a single query condition
 */
export class WhereClause {
  readonly field: string;
  readonly operator: WhereFilterOp;
  readonly value: unknown;

  private constructor(field: string, operator: WhereFilterOp, value: unknown) {
    this.field = field;
    this.operator = operator;
    this.value = Object.freeze(value);
  }

  /**
   * Create a where clause
   */
  static create(field: string, operator: WhereFilterOp, value: unknown): WhereClause {
    return new WhereClause(field, operator, value);
  }

  /**
   * Create equality clause (==)
   */
  static equals(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '==', value);
  }

  /**
   * Create inequality clause (!=)
   */
  static notEquals(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '!=', value);
  }

  /**
   * Create less than clause (<)
   */
  static lessThan(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '<', value);
  }

  /**
   * Create less than or equal clause (<=)
   */
  static lessThanOrEqual(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '<=', value);
  }

  /**
   * Create greater than clause (>)
   */
  static greaterThan(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '>', value);
  }

  /**
   * Create greater than or equal clause (>=)
   */
  static greaterThanOrEqual(field: string, value: unknown): WhereClause {
    return new WhereClause(field, '>=', value);
  }

  /**
   * Create array contains clause
   */
  static arrayContains(field: string, value: unknown): WhereClause {
    return new WhereClause(field, 'array-contains', value);
  }

  /**
   * Create array contains any clause
   */
  static arrayContainsAny(field: string, values: unknown[]): WhereClause {
    return new WhereClause(field, 'array-contains-any', values);
  }

  /**
   * Create in clause
   */
  static in(field: string, values: unknown[]): WhereClause {
    return new WhereClause(field, 'in', values);
  }

  /**
   * Create not-in clause
   */
  static notIn(field: string, values: unknown[]): WhereClause {
    return new WhereClause(field, 'not-in', values);
  }

  /**
   * Validate where clause
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate field name
    if (!this.field || typeof this.field !== 'string' || this.field.trim() === '') {
      errors.push('Field name must be a non-empty string');
    }

    // Validate operator
    const validOperators: WhereFilterOp[] = [
      '==', '!=', '<', '<=', '>', '>=',
      'array-contains', 'array-contains-any', 'in', 'not-in'
    ];
    if (!validOperators.includes(this.operator)) {
      errors.push(`Invalid operator: ${this.operator}`);
    }

    // Validate value based on operator
    if (this.operator === 'array-contains-any' || this.operator === 'in' || this.operator === 'not-in') {
      if (!Array.isArray(this.value)) {
        errors.push(`Operator ${this.operator} requires an array value`);
      } else if (this.value.length === 0) {
        errors.push(`Operator ${this.operator} requires a non-empty array`);
      } else if (this.value.length > 10) {
        errors.push(`Operator ${this.operator} supports maximum 10 elements`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if equals another where clause
   */
  equals(other: WhereClause): boolean {
    return (
      this.field === other.field &&
      this.operator === other.operator &&
      JSON.stringify(this.value) === JSON.stringify(other.value)
    );
  }

  /**
   * Check if compatible for compound queries
   * Some operator combinations are not allowed in Firestore
   */
  isCompatibleWith(other: WhereClause): boolean {
    // Equality and inequality operators can be combined
    // Array operators and membership operators have restrictions
    if (
      (this.isArrayOperator() || this.isMembership()) &&
      (other.isArrayOperator() || other.isMembership())
    ) {
      // Only one array/membership clause per query
      return false;
    }

    return true;
  }

  /**
   * Get field path components
   * Returns array of field path segments (for nested fields)
   */
  getFieldPath(): string[] {
    return this.field.split('.');
  }

  /**
   * Check if field is nested (contains dots)
   */
  isNestedField(): boolean {
    return this.field.includes('.');
  }

  /**
   * Get top-level field name
   */
  getTopLevelField(): string {
    return this.getFieldPath()[0];
  }

  /**
   * Get human-readable description
   */
  getDescription(): string {
    const valueStr = Array.isArray(this.value)
      ? `[${this.value.map(v => JSON.stringify(v)).join(', ')}]`
      : JSON.stringify(this.value);

    return `${this.field} ${this.operator} ${valueStr}`;
  }

  /**
   * Convert to plain object (for serialization)
   */
  toObject(): { field: string; operator: WhereFilterOp; value: unknown } {
    return {
      field: this.field,
      operator: this.operator,
      value: this.value,
    };
  }

  /**
   * Create from plain object
   */
  static fromObject(obj: { field: string; operator: WhereFilterOp; value: unknown }): WhereClause {
    return WhereClause.create(obj.field, obj.operator, obj.value);
  }

  /**
   * Clone with new value
   */
  withValue(newValue: unknown): WhereClause {
    return new WhereClause(this.field, this.operator, newValue);
  }

  /**
   * Clone with new field
   */
  withField(newField: string): WhereClause {
    return new WhereClause(newField, this.operator, this.value);
  }

  /**
   * Clone with new operator
   */
  withOperator(newOperator: WhereFilterOp): WhereClause {
    return new WhereClause(this.field, newOperator, this.value);
  }

  /**
   * Check if is equality operator
   */
  isEquality(): boolean {
    return this.operator === '==';
  }

  /**
   * Check if is inequality operator
   */
  isInequality(): boolean {
    return this.operator === '!=';
  }

  /**
   * Check if is comparison operator (<, <=, >, >=)
   */
  isComparison(): boolean {
    return ['<', '<=', '>', '>='].includes(this.operator);
  }

  /**
   * Check if is array operator
   */
  isArrayOperator(): boolean {
    return ['array-contains', 'array-contains-any'].includes(this.operator);
  }

  /**
   * Check if is membership operator (in, not-in)
   */
  isMembership(): boolean {
    return ['in', 'not-in'].includes(this.operator);
  }

  /**
   * Check if operator requires array value
   */
  requiresArrayValue(): boolean {
    return ['array-contains-any', 'in', 'not-in'].includes(this.operator);
  }
}
