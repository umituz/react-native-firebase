/**
 * Quota Error Detection Utilities
 */

const QUOTA_ERROR_CODES = [
    'resource-exhausted',
    'quota-exceeded',
    'RESOURCE_EXHAUSTED',
];

const QUOTA_ERROR_MESSAGES = [
    'quota exceeded',
    'quota limit',
    'daily limit',
    'resource exhausted',
    'too many requests',
];

/**
 * Check if error is a Firestore quota error
 */
export function isQuotaError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const code = 'code' in error && typeof (error as Record<string, unknown>).code === 'string'
        ? (error as Record<string, unknown>).code as string
        : undefined;
    const message = 'message' in error && typeof (error as Record<string, unknown>).message === 'string'
        ? (error as Record<string, unknown>).message as string
        : undefined;

    if (code && QUOTA_ERROR_CODES.some((c) => code.includes(c))) {
        return true;
    }

    if (message) {
        const lowerMessage = message.toLowerCase();
        return QUOTA_ERROR_MESSAGES.some((m) => lowerMessage.includes(m));
    }

    return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const code = 'code' in error && typeof (error as Record<string, unknown>).code === 'string'
        ? (error as Record<string, unknown>).code as string
        : undefined;

    const retryableCodes = ['unavailable', 'deadline-exceeded', 'aborted'];

    return code ? retryableCodes.some((c) => code.includes(c)) : false;
}

/**
 * Get user-friendly quota error message
 */
export function getQuotaErrorMessage(): string {
    return 'Daily quota exceeded. Please try again tomorrow or upgrade your plan.';
}
