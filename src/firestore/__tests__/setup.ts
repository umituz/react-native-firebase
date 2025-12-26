/**
 * Jest setup file
 */

// Mock __DEV__ for tests
export { };

declare global {
  var mockFirestore: () => any;
  var mockFirebaseError: (code: string, message: string) => any;
}

if (typeof (global as any).__DEV__ === 'undefined') {
  (global as any).__DEV__ = true;
}

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };

const globalAny = global as any;

/**
 * We check if beforeEach is available before using it
 * This avoids errors when running tsc or in environments without Jest
 */
if (typeof globalAny.beforeEach !== 'undefined') {
  globalAny.beforeEach(() => {
    // Restore console methods before each test
    Object.assign(console, originalConsole);
  });
}

// Set up global test utilities
globalAny.mockFirestore = () => ({
  collection: globalAny.jest?.fn() || (() => ({})),
  doc: globalAny.jest?.fn() || (() => ({})),
  runTransaction: globalAny.jest?.fn() || (() => Promise.resolve()),
  batch: globalAny.jest?.fn() || (() => ({})),
});

globalAny.mockFirebaseError = (code: string, message: string) => {
  const error = new Error(message) as any;
  error.code = code;
  return error;
};