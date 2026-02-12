/**
 * Composite Validators
 * Higher-order validators for combining multiple validation rules
 */

/**
 * Create a validator that combines multiple validators (AND logic)
 * All validators must pass
 */
export function combineValidators(
  ...validators: ((value: string) => boolean)[]
): (value: string) => boolean {
  return (value: string) => validators.every((validator) => validator(value));
}

/**
 * Create a validator that checks if value matches one of validators (OR logic)
 * At least one validator must pass
 */
export function anyValidator(
  ...validators: ((value: string) => boolean)[]
): (value: string) => boolean {
  return (value: string) => validators.some((validator) => validator(value));
}
