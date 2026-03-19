/**
 * Firebase Auth Store
 * Basic Zustand store for Firebase Auth state
 *
 * NOTE: For comprehensive auth state management including
 * user types and guest mode, use @umituz/react-native-auth package.
 * This store provides minimal state for low-level Firebase operations.
 */

import { createStore, type SetState, type GetState } from "@umituz/react-native-design-system/storage";
import { onAuthStateChanged, type User, type Auth } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  listenerSetup: boolean;
}

interface AuthActions {
  setupListener: (auth: Auth) => void;
  cleanup: () => void;
  destroy: () => void; // Force destroy regardless of component count
}

let unsubscribe: (() => void) | null = null;
// Mutex flag to prevent race condition in setupListener
let setupInProgress = false;
// Track number of active components using this store
let activeComponentCount = 0;
// Flag to prevent any operations after destroy
let storeDestroyed = false;

export const useFirebaseAuthStore = createStore<AuthState, AuthActions>({
  name: "firebase-auth-store",
  initialState: {
    user: null,
    loading: true,
    initialized: false,
    listenerSetup: false,
  },
  persist: false,
  actions: (set: SetState<AuthState>, get: GetState<AuthState>) => ({
    setupListener: (auth: Auth) => {
      if (storeDestroyed) {
        return; // Don't allow setup after destroy
      }

      const state = get();

      // Atomic check: both state flag AND in-progress mutex
      // This prevents multiple simultaneous calls from setting up listeners
      if (state.listenerSetup || unsubscribe || setupInProgress) {
        // Increment component count even if listener already exists
        activeComponentCount++;
        return;
      }

      // Set mutex immediately (synchronous, before any async operation)
      // This ensures no other call can pass the check above
      setupInProgress = true;
      activeComponentCount++;
      set({ listenerSetup: true, loading: true });

      try {
        unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
          if (!storeDestroyed) {
            set({
              user: currentUser,
              loading: false,
              initialized: true,
            });
          }
        });

        // Listener setup complete - keep mutex locked until cleanup
        // (setupInProgress remains true to indicate active listener)
      } catch (error) {
        // On error, clean up partially initialized listener and release the mutex
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        setupInProgress = false;
        // Only decrement if we successfully incremented (wasn't already set up)
        if (state.listenerSetup === false && !unsubscribe) {
          activeComponentCount--;
        }
        set({ listenerSetup: false, loading: false });
        throw error; // Re-throw to allow caller to handle
      }
    },

    cleanup: () => {
      if (storeDestroyed) {
        return; // Already destroyed
      }

      // Decrement component count
      activeComponentCount--;

      // Only cleanup if no components are using the store
      // This prevents premature cleanup when multiple components use the hook
      if (activeComponentCount <= 0) {
        activeComponentCount = 0;

        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        // Reset mutex on cleanup
        setupInProgress = false;
        set({
          user: null,
          loading: true,
          initialized: false,
          listenerSetup: false,
        });
      }
    },

    destroy: () => {
      // Force destroy regardless of component count
      // This is useful for app shutdown or testing
      storeDestroyed = true;
      activeComponentCount = 0;

      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      setupInProgress = false;
      set({
        user: null,
        loading: true,
        initialized: false,
        listenerSetup: false,
      });
    },
  }),
});
