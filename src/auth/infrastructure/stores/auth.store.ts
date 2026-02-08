/**
 * Firebase Auth Store
 * Basic Zustand store for Firebase Auth state
 *
 * NOTE: For comprehensive auth state management including
 * user types and guest mode, use @umituz/react-native-auth package.
 * This store provides minimal state for low-level Firebase operations.
 */

import { createStore, type SetState, type GetState } from "@umituz/react-native-design-system";
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
}

let unsubscribe: (() => void) | null = null;
// Mutex flag to prevent race condition in setupListener
let setupInProgress = false;

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
      const state = get();

      // Atomic check: both state flag AND in-progress mutex
      // This prevents multiple simultaneous calls from setting up listeners
      if (state.listenerSetup || unsubscribe || setupInProgress) {
        return;
      }

      // Set mutex immediately (synchronous, before any async operation)
      // This ensures no other call can pass the check above
      setupInProgress = true;
      set({ listenerSetup: true, loading: true });

      try {
        unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
          set({
            user: currentUser,
            loading: false,
            initialized: true,
          });
        });

        // Listener setup complete - keep mutex locked until cleanup
        // (setupInProgress remains true to indicate active listener)
      } catch (error) {
        // On error, release the mutex so retry is possible
        setupInProgress = false;
        set({ listenerSetup: false, loading: false });
        if (__DEV__) {
          console.error('[Auth Store] Failed to setup auth listener:', error);
        }
        throw error; // Re-throw to allow caller to handle
      }
    },

    cleanup: () => {
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
    },
  }),
});
