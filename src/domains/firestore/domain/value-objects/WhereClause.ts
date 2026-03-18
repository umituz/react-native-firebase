/**
 * Where Clause Value Object (Main)
 * Single Responsibility: Encapsulate where clause conditions
 *
 * Value object that represents a single where clause condition.
 * Provides validation and business logic for query filtering.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { WhereFilterOp } from 'firebase/firestore';
import * as Validation from './WhereClauseValidation';
import * as Helpers from './WhereClauseHelpers';
import * as Factory from './WhereClauseFactory';

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

  constructor(field: string, operator: WhereFilterOp, value: unknown) {
    this.field = field;
    this.operator = operator;
    this.value = Object.freeze(value);
  }

  // Instance methods using helpers
  validate(): { valid: boolean; errors: string[] } {
    return Validation.validateWhereClause(this);
  }

  equals(other: WhereClause): boolean {
    return Helpers.whereClausesEqual(this, other);
  }

  isCompatibleWith(other: WhereClause): boolean {
    return Helpers.areClausesCompatible(this, other);
  }

  getFieldPath(): string[] {
    return Helpers.getFieldPath(this);
  }

  isNestedField(): boolean {
    return Helpers.isNestedField(this);
  }

  getTopLevelField(): string {
    return Helpers.getTopLevelField(this);
  }

  getDescription(): string {
    return Helpers.getDescription(this);
  }

  toObject(): { field: string; operator: WhereFilterOp; value: unknown } {
    return Helpers.toObject(this);
  }

  withValue(newValue: unknown): WhereClause {
    return new WhereClause(this.field, this.operator, newValue);
  }

  withField(newField: string): WhereClause {
    return new WhereClause(newField, this.operator, this.value);
  }

  withOperator(newOperator: WhereFilterOp): WhereClause {
    return new WhereClause(this.field, newOperator, this.value);
  }

  isEquality(): boolean {
    return Helpers.isEqualityClause(this);
  }

  isInequality(): boolean {
    return Helpers.isInequalityClause(this);
  }

  isComparison(): boolean {
    return Helpers.isComparisonClause(this);
  }

  isArrayOperator(): boolean {
    return Helpers.isArrayClause(this);
  }

  isMembership(): boolean {
    return Helpers.isMembershipClause(this);
  }

  requiresArrayValue(): boolean {
    return Validation.requiresArrayValue(this.operator);
  }
}

