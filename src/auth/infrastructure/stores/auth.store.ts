/**
 * Firebase Auth Store
 * Shared Zustand store for Firebase Auth state
 *
 * CRITICAL: This store ensures only ONE auth listener is created,
 * preventing performance issues from multiple subscriptions.
 */

import { create } from "zustand";
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

type AuthStore = AuthState & AuthActions;

let unsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  listenerSetup: false,

  setupListener: (auth: Auth) => {
    const state = get();

    // Only setup listener once
    if (state.listenerSetup || unsubscribe) {
      return;
    }

    set({ listenerSetup: true });

    unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (__DEV__) {
        console.log(
          "[AuthStore] Auth state changed:",
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
    set({
      user: null,
      loading: true,
      initialized: false,
      listenerSetup: false,
    });
  },
}));
