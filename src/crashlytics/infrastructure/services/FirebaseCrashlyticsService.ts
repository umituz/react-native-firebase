/**
 * Firebase Crashlytics Service
 * Single Responsibility: Orchestrate Crashlytics operations
 */

import { crashlyticsInitializerService } from './crashlytics-initializer.service';
import { crashlyticsErrorService } from './crashlytics-error.service';
import { crashlyticsUserService } from './crashlytics-user.service';
import type { CrashlyticsInstance } from '../adapters/native-crashlytics.adapter';

export interface ICrashlyticsService {
  init(userId?: string, attributes?: Record<string, string>): Promise<void>;
  logError(error: Error, context?: string): Promise<void>;
  log(message: string): Promise<void>;
  setAttribute(key: string, value: string): Promise<void>;
  setAttributes(attributes: Record<string, string>): Promise<void>;
  clearUserData(): Promise<void>;
  destroy(): Promise<void>;
}

class FirebaseCrashlyticsService implements ICrashlyticsService {
  private attributes: Record<string, string> = {};
  private crashlytics: CrashlyticsInstance | null = null;
  private isDestroyed = false;

  async init(userId?: string, attributes?: Record<string, string>): Promise<void> {
    if (this.isDestroyed) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Cannot initialize destroyed service');
      }
      return;
    }

    try {
      this.crashlytics = crashlyticsInitializerService.initialize();

      if (this.crashlytics) {
        if (userId) {
          await crashlyticsUserService.setUserId(this.crashlytics, userId);
        }

        if (attributes) {
          await this.setAttributes(attributes);
        }
      }
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Init failed:', err);
      }
    } finally {
    }
  }

  async logError(error: Error, context?: string): Promise<void> {
    if (this.isDestroyed) return;
    await crashlyticsErrorService.logError(this.crashlytics, error, context);
  }

  async log(message: string): Promise<void> {
    if (this.isDestroyed) return;
    await crashlyticsErrorService.log(this.crashlytics, message);
  }

  async setAttribute(key: string, value: string): Promise<void> {
    if (this.isDestroyed) return;
    this.attributes[key] = value;
    await crashlyticsUserService.setAttribute(this.crashlytics, key, value);
  }

  async setAttributes(attributes: Record<string, string>): Promise<void> {
    if (this.isDestroyed) return;
    await crashlyticsUserService.setAttributes(this.crashlytics, attributes);
    Object.assign(this.attributes, attributes);
  }

  async clearUserData(): Promise<void> {
    if (this.isDestroyed) return;
    await crashlyticsUserService.clearUserData(this.crashlytics);
    this.attributes = {};
  }

  async destroy(): Promise<void> {
    if (this.isDestroyed) return;

    await this.clearUserData();
    this.crashlytics = null;
    this.isDestroyed = true;
  }
}

export const firebaseCrashlyticsService = new FirebaseCrashlyticsService();
