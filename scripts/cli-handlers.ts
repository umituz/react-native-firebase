/**
 * Firebase Admin CLI Command Handlers
 * Individual command implementations
 */

import * as admin from "firebase-admin";
import type { CLIOptions } from "./cli-parser";
import {
  getUserData,
  initializeUserCredits,
  setUserCredits,
  listUsersWithCredits,
  getCreditsSummary,
  printUserData,
} from "./user";
import { printHeader, printSeparator } from "./utils";

/**
 * Handle read-user command
 */
export async function handleReadUser(
  db: admin.firestore.Firestore,
  args: string[],
  options: CLIOptions
): Promise<void> {
  const userId = args[0];
  if (!userId) {
    console.error("❌ Error: userId is required");
    process.exit(1);
  }

  printHeader(`📖 READ USER: ${userId}`);
  const userData = await getUserData(db, userId, {
    creditsCollection: options.creditsCollection,
  });
  printUserData(userData);
}

/**
 * Handle init-credits command
 */
export async function handleInitCredits(
  db: admin.firestore.Firestore,
  args: string[],
  options: CLIOptions
): Promise<void> {
  const userId = args[0];
  if (!userId) {
    console.error("❌ Error: userId is required");
    process.exit(1);
  }

  printHeader(`💰 INIT CREDITS: ${userId}`);
  console.log(`Collection: ${options.creditsCollection}`);
  console.log(`Limits: Text=${options.textLimit}, Image=${options.imageLimit}\n`);

  const existing = await getUserData(db, userId, {
    creditsCollection: options.creditsCollection,
  });

  if (existing.credits) {
    console.log("⚠️  Credits already exist:");
    console.log(`   Text: ${existing.credits.text}`);
    console.log(`   Image: ${existing.credits.image}`);
    console.log("\n   Use 'set-credits' to overwrite.");
    return;
  }

  const credits = await initializeUserCredits(db, userId, {
    collectionName: options.creditsCollection,
    textLimit: options.textLimit,
    imageLimit: options.imageLimit,
  });

  console.log("✅ Credits initialized:");
  console.log(`   Text: ${credits.text}`);
  console.log(`   Image: ${credits.image}`);
}

/**
 * Handle set-credits command
 */
export async function handleSetCredits(
  db: admin.firestore.Firestore,
  args: string[],
  options: CLIOptions
): Promise<void> {
  const userId = args[0];
  const text = parseInt(args[1]);
  const image = parseInt(args[2]);

  if (!userId || isNaN(text) || isNaN(image)) {
    console.error("❌ Error: Usage: set-credits <userId> <text> <image>");
    process.exit(1);
  }

  printHeader(`💰 SET CREDITS: ${userId}`);
  console.log(`Setting: Text=${text}, Image=${image}\n`);

  await setUserCredits(db, userId, { text, image }, options.creditsCollection);

  console.log("✅ Credits set successfully!");

  const updated = await getUserData(db, userId, {
    creditsCollection: options.creditsCollection,
  });
  printUserData(updated);
}

/**
 * Handle list-users command
 */
export async function handleListUsers(
  db: admin.firestore.Firestore,
  args: string[],
  options: CLIOptions
): Promise<void> {
  const limit = parseInt(args[0]) || 100;

  printHeader("👥 USERS WITH CREDITS");
  const users = await listUsersWithCredits(db, {
    creditsCollection: options.creditsCollection,
    limit,
  });

  console.log(`Found ${users.length} users:\n`);
  printSeparator("-", 80);
  console.log(
    "ID".padEnd(30) +
      "Name".padEnd(20) +
      "Text".padEnd(10) +
      "Image".padEnd(10) +
      "Anon"
  );
  printSeparator("-", 80);

  users.forEach((u) => {
    const text = u.credits?.text ?? "-";
    const image = u.credits?.image ?? "-";
    console.log(
      u.userId.substring(0, 28).padEnd(30) +
        (u.displayName || "-").substring(0, 18).padEnd(20) +
        String(text).padEnd(10) +
        String(image).padEnd(10) +
        (u.isAnonymous ? "Yes" : "No")
    );
  });
  printSeparator("-", 80);
}

/**
 * Handle credits-summary command
 */
export async function handleCreditsSummary(
  db: admin.firestore.Firestore,
  options: CLIOptions
): Promise<void> {
  printHeader("📊 CREDITS SUMMARY");
  const summary = await getCreditsSummary(db, options.creditsCollection);

  console.log(`Total Users:     ${summary.totalUsers}`);
  console.log(`With Credits:    ${summary.usersWithCredits}`);
  console.log(`Zero Credits:    ${summary.usersWithZeroCredits}`);
  console.log();
  console.log("Total Credits Across All Users:");
  console.log(`  Text:  ${summary.totalText}`);
  console.log(`  Image: ${summary.totalImage}`);
  console.log(`  Video: ${summary.totalVideo}`);
  console.log(`  Audio: ${summary.totalAudio}`);
}
