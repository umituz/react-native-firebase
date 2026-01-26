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

declare const __DEV__: boolean;

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
      if (state.listenerSetup || unsubscribe || setupInProgress) {
        return;
      }

      // Set mutex immediately (synchronous, before any async operation)
      setupInProgress = true;
      set({ listenerSetup: true });

      unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
           
          console.log(
            "[FirebaseAuthStore] Auth state changed:",
            currentUser?.uid || "null"
          );
        }
        set({
          user: currentUser,
          loading: false,
          initialized: true,
        });
      });
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
