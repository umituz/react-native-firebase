/**
 * Firebase Type Definitions
 *
 * These types mirror Firebase SDK types but don't import from the firebase package.
 * This prevents the 'idb' dependency that causes bundling errors in React Native.
 */

// =============================================================================
// Firebase App Types
// =============================================================================

export interface FirebaseApp {
  name: string;
  options?: FirebaseAppOptions;
}

export interface FirebaseAppOptions {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// =============================================================================
// Firestore Types
// =============================================================================

// Firestore type - use 'any' to avoid type conflicts with Firebase SDK
// In your app, import the actual type: import type { Firestore } from 'firebase/firestore'
export type Firestore = any;

export interface DocumentSnapshot<T = unknown> {
  id: string;
  ref: DocumentReference<T>;
  data: T | null;
  metadata: SnapshotMetadata;
  exists(): boolean;
}

export interface SnapshotMetadata {
  hasPendingWrites: boolean;
  fromCache: boolean;
}

export interface QuerySnapshot<T = unknown> {
  docs: QueryDocumentSnapshot<T>[];
  metadata: SnapshotMetadata;
  size: number;
  empty: boolean;
  docChanges: DocumentChange<T>[];
}

export interface QueryDocumentSnapshot<T = unknown> extends DocumentSnapshot<T> {}

export interface DocumentReference<T = unknown> {
  id: string;
  firestore: Firestore;
  path: string;
  parent: CollectionReference<T> | null;
  get(): Promise<DocumentSnapshot<T>>;
}

export interface CollectionReference<T = unknown> {
  id: string;
  firestore: Firestore;
  path: string;
  parent: CollectionReference<unknown> | DocumentReference<unknown> | null;
  doc(documentPath?: string): DocumentReference<T>;
}

export interface Query<T = unknown> {
  firestore: Firestore;
}

// =============================================================================
// Firestore Types - Field Values
// =============================================================================

export type FieldPath = string | readonly string[];

export interface FieldValue {
  isEqual(other: unknown): boolean;
}

export interface Bytes {
  toUint8Array(): Uint8Array;
  toBase64(): string;
  toString(format?: 'base64' | 'base64url'): string;
}

// =============================================================================
// Firestore Types - Timestamp
// =============================================================================

export class Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;

  constructor(seconds: number, nanoseconds: number);

  static now(): Timestamp;
  static fromDate(date: Date): Timestamp;
  static fromMillis(milliseconds: number): Timestamp;

  toDate(): Date;
  toMillis(): number;
  toString(): string;
  isEqual(other: Timestamp): boolean;

  valueOf(): number {
    return this.toMillis();
  }
}

// =============================================================================
// Firestore Types - GeoPoint
// =============================================================================

export class GeoPoint {
  readonly latitude: number;
  readonly longitude: number;

  constructor(latitude: number, longitude: number);

  toString(): string;
  isEqual(other: GeoPoint): boolean;
}

// =============================================================================
// Firestore Types - Transaction
// =============================================================================

export interface Transaction {
  get(documentRef: DocumentReference): Promise<DocumentSnapshot>;
  set(documentRef: DocumentReference, data: unknown): Promise<void>;
  update(documentRef: DocumentReference, data: Partial<unknown>): Promise<void>;
  delete(documentRef: DocumentReference): Promise<void>;
}

// =============================================================================
// Firestore Types - Query
// =============================================================================

export type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

export type OrderByDirection = 'asc' | 'desc';

export type QueryConstraint = QueryFilterConstraint | QueryOrderByConstraint | QueryLimitConstraint | QueryStartAtConstraint | QueryEndAtConstraint;

export interface QueryFilterConstraint {
  type: 'where';
  fieldPath: FieldPath;
  op: WhereFilterOp;
  value: unknown;
}

export interface QueryOrderByConstraint {
  type: 'orderBy';
  fieldPath: FieldPath;
  direction?: OrderByDirection;
}

export interface QueryLimitConstraint {
  type: 'limit';
  limit: number;
}

export interface QueryStartAtConstraint {
  type: 'startAt';
  cursor: unknown;
}

export interface QueryEndAtConstraint {
  type: 'endAt';
  cursor: unknown;
}

// =============================================================================
// Auth Types
// =============================================================================

export interface Auth {
  app: FirebaseApp;
  currentUser: User | null;
}

export interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  providerId: string;
  metadata: UserMetadata;
  isAnonymous: boolean;
}

export interface UserMetadata {
  creationTime?: string;
  lastSignInTime?: string | null;
}

export interface UserCredential {
  user: User;
  providerId: string | null;
  operationType?: string;
}

export interface AuthCredential {
  providerId: string;
  signInMethod: string;
}

// =============================================================================
// Error Types
// =============================================================================

export interface FirestoreError {
  code: string;
  message: string;
  name: string;
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

export interface FirebaseError extends Error {
  code: string;
  name: string;
}

// =============================================================================
// Change Type
// =============================================================================

export type DocumentChangeType = 'added' | 'removed' | 'modified';

export interface DocumentChange<T = unknown> {
  type: DocumentChangeType;
  doc: QueryDocumentSnapshot<T>;
  oldIndex?: number;
  newIndex?: number;
}

// =============================================================================
// Blob Types
// =============================================================================

export interface Blob {
  bytes: Uint8Array;
}

export function blob(bytes: Uint8Array): Blob {
  return { bytes };
}
