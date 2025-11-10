/**
 * Error Tracking Decorator
 *
 * DDD Pattern: Decorator for automatic error logging to Firebase Crashlytics
 */

import { firebaseCrashlyticsService } from '../../infrastructure/services/crashlytics/FirebaseCrashlyticsService';

export function TrackErrors(
  serviceName: string,
  errorType: 'database' | 'network' | 'auth' | 'cache' | 'generic' = 'generic'
) {
  return function (
    _target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Unknown error');
        const context = `${serviceName}.${propertyKey}`;

        await firebaseCrashlyticsService.logError(errorObj, context);

        throw error;
      }
    };

    return descriptor;
  };
}

export async function trackErrors<T>(
  serviceName: string,
  operation: () => Promise<T>,
  errorType: 'database' | 'network' | 'auth' | 'cache' | 'generic' = 'generic'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error('Unknown error');
    await firebaseCrashlyticsService.logError(errorObj, serviceName);
    throw error;
  }
}


