/**
 * Firebase Config - Domain Layer
 * 
 * Domain-Driven Design: Value Object representing Firebase configuration parameters
 */
export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}
