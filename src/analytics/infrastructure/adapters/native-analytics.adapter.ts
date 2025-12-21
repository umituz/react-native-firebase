/**
 * Native Analytics Adapter
 * Single Responsibility: Handle Firebase Analytics native implementation
 * Uses React Native Firebase v23+ modular API
 *
 * NOTE: This adapter uses optional import to support Expo Go.
 * Native modules are only available in development builds or standalone apps.
 */

// Optional import - will be null in Expo Go
let nativeAnalytics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nativeAnalytics = require('@react-native-firebase/analytics');
} catch {
  // Native module not available (e.g., Expo Go)
  // eslint-disable-next-line no-console
  if (__DEV__) console.warn('⚠️ Firebase Analytics: Native module not available');
}

export interface NativeAnalyticsAdapter {
  getAnalytics(): any;
  logEvent(analytics: any, eventName: string, params?: Record<string, any>): Promise<void>;
  setUserId(analytics: any, userId: string): Promise<void>;
  setUserProperties(analytics: any, properties: Record<string, string>): Promise<void>;
  resetAnalyticsData(analytics: any): Promise<void>;
  setAnalyticsCollectionEnabled(analytics: any, enabled: boolean): Promise<void>;
}

declare const __DEV__: boolean;

export const nativeAnalyticsAdapter: NativeAnalyticsAdapter | null = nativeAnalytics
  ? {
      getAnalytics(): any {
        return nativeAnalytics.getAnalytics();
      },
      async logEvent(
        analytics: any,
        eventName: string,
        params?: Record<string, any>,
      ): Promise<void> {
        await nativeAnalytics.logEvent(analytics, eventName, params);
      },
      async setUserId(analytics: any, userId: string): Promise<void> {
        await nativeAnalytics.setUserId(analytics, userId);
      },
      async setUserProperties(
        analytics: any,
        properties: Record<string, string>,
      ): Promise<void> {
        await nativeAnalytics.setUserProperties(analytics, properties);
      },
      async resetAnalyticsData(analytics: any): Promise<void> {
        await nativeAnalytics.resetAnalyticsData(analytics);
      },
      async setAnalyticsCollectionEnabled(
        analytics: any,
        enabled: boolean,
      ): Promise<void> {
        await nativeAnalytics.setAnalyticsCollectionEnabled(analytics, enabled);
      },
    }
  : null;
