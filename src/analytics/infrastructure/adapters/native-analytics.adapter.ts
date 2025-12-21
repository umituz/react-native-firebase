/**
 * Native Analytics Adapter
 * Single Responsibility: Handle Firebase Analytics native implementation
 * Uses React Native Firebase v23+ modular API
 */

import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
  resetAnalyticsData,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';

export interface NativeAnalyticsAdapter {
  getAnalytics(): any;
  logEvent(analytics: any, eventName: string, params?: Record<string, any>): Promise<void>;
  setUserId(analytics: any, userId: string): Promise<void>;
  setUserProperties(analytics: any, properties: Record<string, string>): Promise<void>;
  resetAnalyticsData(analytics: any): Promise<void>;
  setAnalyticsCollectionEnabled(analytics: any, enabled: boolean): Promise<void>;
}

export const nativeAnalyticsAdapter: NativeAnalyticsAdapter = {
  getAnalytics(): any {
    return getAnalytics();
  },
  async logEvent(
    analytics: any,
    eventName: string,
    params?: Record<string, any>,
  ): Promise<void> {
    await logEvent(analytics, eventName, params);
  },
  async setUserId(analytics: any, userId: string): Promise<void> {
    await setUserId(analytics, userId);
  },
  async setUserProperties(
    analytics: any,
    properties: Record<string, string>,
  ): Promise<void> {
    await setUserProperties(analytics, properties);
  },
  async resetAnalyticsData(analytics: any): Promise<void> {
    await resetAnalyticsData(analytics);
  },
  async setAnalyticsCollectionEnabled(
    analytics: any,
    enabled: boolean,
  ): Promise<void> {
    await setAnalyticsCollectionEnabled(analytics, enabled);
  },
};
