/**
 * Shared Hook Utilities
 * Re-exports all hook utilities for backward compatibility
 * @deprecated Import from specific files instead
 */

// State Management Hooks
export type { HookState, HookStateActions } from './state-hooks.util';
export { useHookState, useAsyncOperation } from './state-hooks.util';

// Safe State Hooks
export {
  useIsMounted,
  useSafeState,
  useDebouncedValue,
  useCleanup,
} from './safe-state-hooks.util';

// Auth Hooks
export { createAuthStateHandler, useAuthListener } from './auth-hooks.util';
