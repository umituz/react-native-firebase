export const ERROR_MESSAGES = {
  AUTH: {
    NOT_INITIALIZED: 'Firebase Auth is not initialized',
    NOT_AUTHENTICATED: 'User must be authenticated',
    ANONYMOUS_ONLY: 'Anonymous users cannot perform this action',
    NON_ANONYMOUS_ONLY: 'Guest users cannot perform this action',
    SIGN_OUT_REQUIRED: 'Sign out first before performing this action',
    NO_USER: 'No user is currently signed in',
    INVALID_USER: 'Invalid user',
  },
  FIRESTORE: {
    NOT_INITIALIZED: 'Firestore is not initialized',
    QUOTA_EXCEEDED: 'Daily quota exceeded. Please try again tomorrow or upgrade your plan.',
  },
  REPOSITORY: {
    DESTROYED: 'Repository has been destroyed',
  },
  SERVICE: {
    NOT_CONFIGURED: 'Service is not configured',
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
