/**
 * Field Name Validation Utility
 * Validates Firestore field names
 */

const RESERVED_FIELDS = ['__name__', '__id__'];

/**
 * Validates a Firestore field name
 * @param field - The field name to validate
 * @returns true if field name is valid, false otherwise
 */
export function isValidFieldName(field: string): boolean {
  if (typeof field !== 'string' || field.length === 0) {
    return false;
  }

  // Reserved fields
  if (RESERVED_FIELDS.includes(field)) {
    return false;
  }

  // Reserved prefix
  if (field.startsWith('__')) {
    return false;
  }

  return true;
}
