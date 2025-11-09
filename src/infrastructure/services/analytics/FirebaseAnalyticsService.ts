/**
 * Firebase Analytics Service
 *
 * Single Responsibility: Handle Firebase Analytics tracking
 * Platform-agnostic interface with platform-specific implementations
 */

import { Platform } from 'react-native';
import { getFirebaseApp } from '../../config/FirebaseClient';

// Web implementation
let webAnalytics: any = null;
if (Platform.OS === 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAnalytics, logEvent, setUserId, setUserProperties, Analytics } = require('firebase/analytics');
    webAnalytics = { getAnalytics, logEvent, setUserId, setUserProperties, Analytics };
  } catch {
    // Firebase Analytics not available
  }
}

// Native implementation
let nativeAnalytics: any = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@react-native-firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const analytics = require('@react-native-firebase/analytics');
    nativeAnalytics = analytics;
  } catch {
    // @react-native-firebase/analytics not available
  }
}

export interface IAnalyticsService {
  init(userId?: string): Promise<void>;
  logEvent(eventName: string, params?: Record<string, string | number | boolean | null>): Promise<void>;
  setUserProperty(key: string, value: string): Promise<void>;
  setUserProperties(properties: Record<string, string>): Promise<void>;
  clearUserData(): Promise<void>;
  getCurrentUserId(): string | null;
}

class FirebaseAnalyticsService implements IAnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private userProperties: Record<string, string> = {};
  private analytics: any = null;

  async init(userId?: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await this.initWeb(userId);
      } else {
        await this.initNative(userId);
      }
    } catch (_error) {
      // Analytics is non-critical, fail silently
      this.isInitialized = true;
    }
  }

  private async initWeb(userId?: string): Promise<void> {
    if (!webAnalytics) {
      this.isInitialized = true;
      return;
    }

    try {
      const app = getFirebaseApp();
      if (!this.analytics) {
        this.analytics = webAnalytics.getAnalytics(app);
      }
    } catch {
      this.isInitialized = true;
      return;
    }

    if (userId) {
      this.userId = userId;
      await webAnalytics.setUserId(this.analytics, userId);
      await this.setUserProperty('user_type', 'authenticated');
    } else {
      await this.setUserProperty('user_type', 'guest');
    }

    this.isInitialized = true;
  }

  private async initNative(userId?: string): Promise<void> {
    if (!nativeAnalytics) {
      this.isInitialized = true;
      return;
    }

    try {
      this.analytics = nativeAnalytics.getAnalytics();
      
      if (userId) {
        this.userId = userId;
        await nativeAnalytics.setUserId(this.analytics, userId);
        await this.setUserProperty('user_type', 'authenticated');
      } else {
        await this.setUserProperty('user_type', 'guest');
      }
    } catch {
      // Silent fail
    }

    this.isInitialized = true;
  }

  async logEvent(
    eventName: string,
    params?: Record<string, string | number | boolean | null>
  ): Promise<void> {
    try {
      if (!this.analytics) {
        return;
      }

      if (Platform.OS === 'web' && webAnalytics) {
        await webAnalytics.logEvent(this.analytics, eventName, params);
      } else if (Platform.OS !== 'web' && nativeAnalytics) {
        await nativeAnalytics.logEvent(this.analytics, eventName, params);
      }
    } catch (_error) {
      // Silent fail
    }
  }

  async setUserProperty(key: string, value: string): Promise<void> {
    try {
      if (!this.analytics) {
        return;
      }

      this.userProperties[key] = value;

      if (Platform.OS === 'web' && webAnalytics) {
        await webAnalytics.setUserProperties(this.analytics, { [key]: value });
      } else if (Platform.OS !== 'web' && nativeAnalytics) {
        await nativeAnalytics.setUserProperties(this.analytics, { [key]: value });
      }
    } catch (_error) {
      // Silent fail
    }
  }

  async setUserProperties(properties: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(properties)) {
      await this.setUserProperty(key, value);
    }
  }

  async clearUserData(): Promise<void> {
    try {
      if (!this.analytics) {
        return;
      }

      if (Platform.OS === 'web' && webAnalytics) {
        await webAnalytics.setUserId(this.analytics, '');
        await webAnalytics.setUserProperties(this.analytics, {});
      } else if (Platform.OS !== 'web' && nativeAnalytics) {
        await nativeAnalytics.setUserId(this.analytics, '');
        await nativeAnalytics.setUserProperties(this.analytics, {});
        if (nativeAnalytics.resetAnalyticsData) {
          await nativeAnalytics.resetAnalyticsData(this.analytics);
        }
      }

      this.userId = null;
      this.userProperties = {};
      this.isInitialized = false;
    } catch (_error) {
      // Silent fail
    }
  }

  getCurrentUserId(): string | null {
    return this.userId;
  }

  /**
   * Log screen view
   */
  async logScreenView(params: {
    screen_name: string;
    screen_class?: string;
  }): Promise<void> {
    try {
      await this.logEvent('screen_view', {
        screen_name: params.screen_name,
        screen_class: params.screen_class || params.screen_name,
      });
    } catch (_error) {
      // Silent fail
    }
  }
}

export const firebaseAnalyticsService = new FirebaseAnalyticsService();

