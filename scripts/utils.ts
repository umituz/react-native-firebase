/**
 * Firebase Admin Scripts - Utility Functions
 * Generic helpers for seeding and testing
 */

/**
 * Generate random ID
 */
export function randomId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Generate random date within the past N days
 */
export function randomDate(daysAgo: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime =
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTime);
}

/**
 * Get random item from array
 */
export function randomItem<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error("Cannot pick random item from empty array");
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random number in range
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random boolean
 */
export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 0) return "-" + formatBytes(-bytes);
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Create a confirmation prompt (for CLI scripts)
 */
export function createConfirmationTimer(
  seconds: number,
  warningMessage: string
): Promise<void> {
  return new Promise((resolve) => {
    console.log(warningMessage);
    console.log(`\nPress Ctrl+C to cancel, or wait ${seconds} seconds to continue...\n`);
    setTimeout(resolve, seconds * 1000);
  });
}

/**
 * Print separator line
 */
export function printSeparator(char = "=", length = 70): void {
  console.log(char.repeat(length));
}

/**
 * Print header with separators
 */
export function printHeader(title: string): void {
  printSeparator();
  console.log(title);
  printSeparator();
  console.log();
}
