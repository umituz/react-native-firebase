/**
 * Query Options Validation
 * Single Responsibility: Validate and check query options
 *
 * Validation and type checking functionality for QueryOptions.
 * Separated for better maintainability.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { QueryOptions } from './QueryOptions';

/**
 * Validate query options
 */
export function validateOptions(options: QueryOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate where clauses
  for (const clause of options.whereClauses) {
    const clauseValidation = clause.validate();
    if (!clauseValidation.valid) {
      errors.push(...clauseValidation.errors);
    }
  }

  // Validate sort options
  for (const sort of options.sortOptions) {
    if (!sort.field || typeof sort.field !== 'string') {
      errors.push('Sort field must be a non-empty string');
    }
    if (sort.direction !== 'asc' && sort.direction !== 'desc') {
      errors.push('Sort direction must be "asc" or "desc"');
    }
  }

  // Validate date range
  if (options.dateRange) {
    if (!options.dateRange.field || typeof options.dateRange.field !== 'string') {
      errors.push('Date range field must be a non-empty string');
    }
    if (options.dateRange.startDate && !(options.dateRange.startDate instanceof Date)) {
      errors.push('Start date must be a Date instance');
    }
    if (options.dateRange.endDate && !(options.dateRange.endDate instanceof Date)) {
      errors.push('End date must be a Date instance');
    }
    if (
      options.dateRange.startDate &&
      options.dateRange.endDate &&
      options.dateRange.startDate > options.dateRange.endDate
    ) {
      errors.push('Start date must be before end date');
    }
  }

  // Validate pagination
  if (options.pagination) {
    if (options.pagination.limit !== undefined && (typeof options.pagination.limit !== 'number' || options.pagination.limit <= 0)) {
      errors.push('Pagination limit must be a positive number');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if has any where clauses
 */
export function hasWhereClauses(options: QueryOptions): boolean {
  return options.whereClauses.length > 0;
}

/**
 * Check if has any sort options
 */
export function hasSort(options: QueryOptions): boolean {
  return options.sortOptions.length > 0;
}

/**
 * Check if has date range
 */
export function hasDateRange(options: QueryOptions): boolean {
  return options.dateRange !== null;
}

/**
 * Check if has pagination
 */
export function hasPagination(options: QueryOptions): boolean {
  return options.pagination !== null;
}

/**
 * Check if is empty (no options set)
 */
export function isEmpty(options: QueryOptions): boolean {
  return !hasWhereClauses(options) &&
         !hasSort(options) &&
         !hasDateRange(options) &&
         !hasPagination(options);
}

/**
 * Check if options have date range filter
 */
export function hasDateFilter(options: QueryOptions): boolean {
  return hasDateRange(options);
}

/**
 * Check if options have limit set
 */
export function hasLimit(options: QueryOptions): boolean {
  return options.pagination?.limit !== undefined;
}

/**
 * Check if options have cursor set
 */
export function hasCursor(options: QueryOptions): boolean {
  return options.pagination?.cursor !== undefined;
}

/**
 * Check if options are valid for compound queries
 */
export function isValidForCompoundQuery(options: QueryOptions): boolean {
  // Check for array/membership operator conflicts
  const arrayCount = options.whereClauses.filter(c => c.isArrayOperator() || c.isMembership()).length;

  if (arrayCount > 1) {
    return false;
  }

  return validateOptions(options).valid;
}

/**
 * Check if options are ready for execution
 */
export function isReadyToExecute(options: QueryOptions): boolean {
  if (!validateOptions(options).valid) {
    return false;
  }

  // Must have at least one filter
  if (isEmpty(options)) {
    return false;
  }

  return true;
}

/**
 * Get query options type
 */
export function getQueryType(options: QueryOptions): 'empty' | 'simple' | 'complex' {
  if (isEmpty(options)) {
    return 'empty';
  }

  const complexity = options.whereClauses.length + options.sortOptions.length;

  if (complexity <= 2) {
    return 'simple';
  }

  return 'complex';
}

/**
 * Check if query is read-only (no modifications needed)
 */
export function isReadOnly(options: QueryOptions): boolean {
  // Query options are always read-only
  return true;
}
