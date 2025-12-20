/**
 * Tracking Decorator
 * 
 * DDD Pattern: Decorator for automatic event tracking
 */

import { firebaseAnalyticsService } from '../../infrastructure/services/FirebaseAnalyticsService';

/**
 * Decorator to automatically log an event when a method is called
 */
export function TrackEvent(eventName: string, params?: Record<string, any>) {
    return function (
        _target: any,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                await firebaseAnalyticsService.logEvent(eventName, params);
            } catch (error) {
                // Fail silently to not disrupt app flow
            }
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

/**
 * Functional utility to track an event
 */
export async function trackEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    await firebaseAnalyticsService.logEvent(eventName, params);
}
