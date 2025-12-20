/**
 * Firebase Analytics Module
 */

export { firebaseAnalyticsService } from './infrastructure/services/FirebaseAnalyticsService';
export type { IAnalyticsService } from './infrastructure/services/FirebaseAnalyticsService';
export { analyticsInitializerService } from './infrastructure/services/analytics-initializer.service';
export type { AnalyticsInstance } from './infrastructure/services/analytics-initializer.service';
export { analyticsEventService } from './infrastructure/services/analytics-event.service';
export { analyticsUserService } from './infrastructure/services/analytics-user.service';
export { performanceTracker } from './infrastructure/services/PerformanceTracker';

// Hooks
export { useScreenView } from './presentation/hooks/useScreenView';
export { useScreenTime } from './presentation/hooks/useScreenTime';
export { useNavigationTracking } from './presentation/hooks/useNavigationTracking';
export { useNavigationAnalytics } from './presentation/hooks/useNavigationAnalytics';

// Utility Functions
export { trackButtonClick, trackCRUDOperation } from './presentation/utils/analyticsUtils';
