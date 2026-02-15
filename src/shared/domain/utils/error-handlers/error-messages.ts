export const ERROR_MESSAGES = {
  AUTH: {
    NOT_INITIALIZED: 'Firebase Auth is not initialized',
    NOT_AUTHENTICATED: 'User must be authenticated',
    ANONYMOUS_ONLY: 'Anonymous users cannot perform this action',
    NON_ANONYMOUS_ONLY: 'Guest users cannot perform this action',
    SIGN_OUT_REQUIRED: 'Sign out first before performing this action',
    NO_USER: 'No user is currently signed in',
    INVALID_USER: 'Invalid user',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PASSWORD: 'Invalid password',
    WEAK_PASSWORD: 'Password is too weak',
    INVALID_CREDENTIALS: 'Invalid credentials provided',
    USER_CHANGED: 'User changed during operation',
    OPERATION_IN_PROGRESS: 'Operation already in progress',
  },
  FIRESTORE: {
    NOT_INITIALIZED: 'Firestore is not initialized',
    QUOTA_EXCEEDED: 'Daily quota exceeded. Please try again tomorrow or upgrade your plan.',
    INVALID_CURSOR: 'Invalid pagination cursor',
    INVALID_FIELD_NAME: 'Invalid field name',
    INVALID_DATE_RANGE: 'Start date must be before end date',
    BATCH_TOO_LARGE: 'Batch operation exceeds maximum size',
    DOCUMENT_NOT_FOUND: 'Document not found',
    PERMISSION_DENIED: 'Permission denied',
    TRANSACTION_FAILED: 'Transaction failed',
    NETWORK_ERROR: 'Network error occurred',
  },
  REPOSITORY: {
    DESTROYED: 'Repository has been destroyed',
  },
  SERVICE: {
    NOT_CONFIGURED: 'Service is not configured',
  },
  VALIDATION: {
    INVALID_INPUT: 'Invalid input provided',
    REQUIRED_FIELD: 'Required field is missing',
    INVALID_FORMAT: 'Invalid format',
  },
  GENERAL: {
    RETRYABLE: 'Temporary error occurred. Please try again.',
    UNKNOWN: 'Unknown error occurred',
  },
} as const;

export function getQuotaErrorMessage(): string {
  return ERROR_MESSAGES.FIRESTORE.QUOTA_EXCEEDED;
}

export function getRetryableErrorMessage(): string {
  return ERROR_MESSAGES.GENERAL.RETRYABLE;
}
