/**
 * Shared Firebase Storage instance getter
 */

import { getStorage } from "firebase/storage";
import { getFirebaseApp } from "../infrastructure/config/FirebaseClient";

export function getStorageInstance() {
    const app = getFirebaseApp();
    return app ? getStorage(app) : null;
}
