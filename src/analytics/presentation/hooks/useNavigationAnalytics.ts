/**
 * useNavigationAnalytics Hook
 *
 * Tracks navigation analytics at app level for NavigationContainer
 * Migrated to Firebase modular SDK (v22+)
 *
 * Features:
 * - Screen view tracking
 * - Screen time measurement
 * - Navigation flow analytics
 *
 * @example
 * ```typescript
 * import { useNavigationAnalytics } from '@umituz/react-native-firebase';
 *
 * function App() {
 *   const { handleNavigationReady, handleNavigationStateChange } = useNavigationAnalytics();
 *
 *   return (
 *     <NavigationContainer
 *       onReady={() => handleNavigationReady(navigationRef)}
 *       onStateChange={() => handleNavigationStateChange(navigationRef)}
 *     >
 *       <AppNavigator />
 *     </NavigationContainer>
 *   );
 * }
 * ```
 */

import { useRef } from "react";
import { firebaseAnalyticsService } from "../../infrastructure/services/FirebaseAnalyticsService";

export const useNavigationAnalytics = () => {
  const routeNameRef = useRef<string | undefined>(undefined);
  const screenStartTimeRef = useRef<number | undefined>(undefined);

  const getActiveRouteName = (state: any): string | undefined => {
    if (!state || !state.routes) return undefined;
    const route = state.routes[state.index];
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  };

  const handleNavigationReady = (navigationRef: any) => {
    const currentRouteName = getActiveRouteName(
      navigationRef.current?.getRootState(),
    );
    routeNameRef.current = currentRouteName;
    screenStartTimeRef.current = Date.now();

    if (currentRouteName) {
      firebaseAnalyticsService
        .logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        })
        .catch(() => {
          // Silent fail - analytics is non-critical
        });
    }
  };

  const handleNavigationStateChange = async (navigationRef: any) => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(
      navigationRef.current?.getRootState(),
    );

    if (previousRouteName !== currentRouteName && currentRouteName) {
      if (previousRouteName && screenStartTimeRef.current) {
        const timeSpent = Math.round(
          (Date.now() - screenStartTimeRef.current) / 1000,
        );
        await firebaseAnalyticsService
          .logScreenTime({
            screen_name: previousRouteName,
            screen_class: previousRouteName,
            time_spent_seconds: timeSpent,
          })
          .catch(() => {
            // Silent fail - analytics is non-critical
          });
      }

      await firebaseAnalyticsService
        .logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        })
        .catch(() => {
          // Silent fail - analytics is non-critical
        });

      if (previousRouteName) {
        await firebaseAnalyticsService
          .logNavigation({
            from_screen: previousRouteName,
            to_screen: currentRouteName,
            screen_class: currentRouteName,
          })
          .catch(() => {
            // Silent fail - analytics is non-critical
          });
      }

      routeNameRef.current = currentRouteName;
      screenStartTimeRef.current = Date.now();
    }
  };

  return {
    handleNavigationReady,
    handleNavigationStateChange,
  };
};
