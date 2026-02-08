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
 * Type guard for error with code property
 */
function hasCodeProperty(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
}

/**
 * Type guard for error with message property
 */
function hasMessageProperty(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

/**
 * Check if error is a Firestore quota error
 */
export function isQuotaError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    if (hasCodeProperty(error)) {
        const code = error.code;
        // Use more specific matching - exact match or ends with pattern
        return QUOTA_ERROR_CODES.some((c) =>
            code === c || code.endsWith(`/${c}`) || code.startsWith(`${c}/`)
        );
    }

    if (hasMessageProperty(error)) {
        const message = error.message;
        const lowerMessage = message.toLowerCase();
        // Use word boundaries to avoid partial matches
        return QUOTA_ERROR_MESSAGES.some((m) =>
            lowerMessage.includes(` ${m} `) ||
            lowerMessage.startsWith(`${m} `) ||
            lowerMessage.endsWith(` ${m}`) ||
            lowerMessage === m
        );
    }

    return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    if (hasCodeProperty(error)) {
        const code = error.code;
        const retryableCodes = ['unavailable', 'deadline-exceeded', 'aborted'];
        return retryableCodes.some((c) => code.includes(c));
    }

    return false;
}

/**
 * Get user-friendly quota error message
 */
export function getQuotaErrorMessage(): string {
    return 'Daily quota exceeded. Please try again tomorrow or upgrade your plan.';
}
