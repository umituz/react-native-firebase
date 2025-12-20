/**
 * Analytics Service Interface
 * 
 * Application Layer - Port
 * Defines the contract for analytics operations
 */

export interface IAnalyticsService {
    /**
     * Initialize the analytics service
     * @param userId Optional user ID to associate with analytics
     */
    init(userId?: string): Promise<void>;

    /**
     * Set the current user ID
     * @param userId The unique user identifier
     */
    setUserId(userId: string): Promise<void>;

    /**
     * Log a custom event
     * @param eventName Name of the event
     * @param params Optional key-value pairs of parameters
     */
    logEvent(
        eventName: string,
        params?: Record<string, string | number | boolean | null>,
    ): Promise<void>;

    /**
     * Set a user property
     * @param key Property key
     * @param value Property value
     */
    setUserProperty(key: string, value: string): Promise<void>;

    /**
     * Set multiple user properties at once
     * @param properties Key-value pairs of user properties
     */
    setUserProperties(properties: Record<string, string>): Promise<void>;

    /**
     * Clear all user data and reset initialization state
     */
    clearUserData(): Promise<void>;

    /**
     * Get the current user ID if set
     */
    getCurrentUserId(): string | null;

    /**
     * Log a screen view event
     */
    logScreenView(params: { screen_name: string; screen_class?: string }): Promise<void>;

    /**
     * Log time spent on a screen
     */
    logScreenTime(params: {
        screen_name: string;
        screen_class?: string;
        time_spent_seconds: number;
    }): Promise<void>;

    /**
     * Log a navigation event between screens
     */
    logNavigation(params: {
        from_screen: string;
        to_screen: string;
        screen_class?: string;
    }): Promise<void>;

    /**
     * Log a button click event
     */
    logButtonClick(params: {
        button_id: string;
        button_name?: string;
        screen_name: string;
        screen_class?: string;
    }): Promise<void>;

    /**
     * Enable or disable analytics collection
     * @param enabled Whether collection should be enabled
     */
    setAnalyticsCollectionEnabled(enabled: boolean): Promise<void>;
}
