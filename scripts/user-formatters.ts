/**
 * Firebase Admin User Formatters
 * Format functions for displaying user data
 */

import type { UserData } from "./types";

/**
 * Print user data in formatted way
 */
export function printUserData(data: UserData): void {
  console.log("\n" + "═".repeat(60));
  console.log(`👤 USER: ${data.userId}`);
  console.log("═".repeat(60));

  console.log("\n📋 PROFILE:");
  if (data.profile) {
    console.log(JSON.stringify(data.profile, null, 2));
  } else {
    console.log("  ❌ Not found");
  }

  console.log("\n💰 CREDITS:");
  if (data.credits) {
    console.log(`  Text:  ${data.credits.text || 0}`);
    console.log(`  Image: ${data.credits.image || 0}`);
    console.log(`  Video: ${data.credits.video || 0}`);
    console.log(`  Audio: ${data.credits.audio || 0}`);
  } else {
    console.log("  ❌ Not found");
  }

  console.log("\n🔔 SUBSCRIPTIONS:");
  if (data.subscriptions.length > 0) {
    data.subscriptions.forEach((sub) => {
      console.log(`  - ${sub.id}: ${JSON.stringify(sub)}`);
    });
  } else {
    console.log("  ❌ None");
  }

  console.log("\n🧾 TRANSACTIONS:");
  if (data.transactions.length > 0) {
    data.transactions.slice(0, 5).forEach((tx) => {
      console.log(`  - ${tx.id}: ${JSON.stringify(tx)}`);
    });
    if (data.transactions.length > 5) {
      console.log(`  ... and ${data.transactions.length - 5} more`);
    }
  } else {
    console.log("  ❌ None");
  }

  console.log("\n" + "═".repeat(60) + "\n");
}
