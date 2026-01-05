#!/usr/bin/env node
/**
 * Firebase Admin CLI
 * Unified CLI for Firebase Admin operations
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register node_modules/@umituz/react-native-firebase/scripts/cli.ts <command> [options]
 *
 * Commands:
 *   read-user <userId>                    Read user data
 *   init-credits <userId>                 Initialize credits for user
 *   set-credits <userId> <text> <image>   Set credits for user
 *   list-users                            List all users with credits
 *   credits-summary                       Get credits summary
 *
 * Options:
 *   --service-account <path>   Path to service account JSON (default: ./firebase-service-account.json)
 *   --project-id <id>          Firebase project ID
 *   --credits-collection <name> Credits collection name (default: user_credits)
 *   --text-limit <n>           Default text credit limit (default: 100)
 *   --image-limit <n>          Default image credit limit (default: 100)
 */

import * as path from "path";
import * as fs from "fs";
import {
  initFirebaseAdmin,
  getFirestoreAdmin,
  resetFirebaseAdmin,
} from "./init";
import {
  getUserData,
  initializeUserCredits,
  setUserCredits,
  listUsersWithCredits,
  getCreditsSummary,
  printUserData,
} from "./user";
import { printHeader, printSeparator } from "./utils";

interface CLIOptions {
  serviceAccountPath: string;
  projectId?: string;
  creditsCollection: string;
  textLimit: number;
  imageLimit: number;
}

function parseArgs(): { command: string; args: string[]; options: CLIOptions } {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  const commandArgs: string[] = [];
  const options: CLIOptions = {
    serviceAccountPath: "./firebase-service-account.json",
    creditsCollection: "user_credits",
    textLimit: 100,
    imageLimit: 100,
  };

  let i = 1;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[++i];
      switch (key) {
        case "service-account":
          options.serviceAccountPath = value;
          break;
        case "project-id":
          options.projectId = value;
          break;
        case "credits-collection":
          options.creditsCollection = value;
          break;
        case "text-limit":
          options.textLimit = parseInt(value) || 100;
          break;
        case "image-limit":
          options.imageLimit = parseInt(value) || 100;
          break;
      }
    } else {
      commandArgs.push(arg);
    }
    i++;
  }

  return { command, args: commandArgs, options };
}

function getProjectId(options: CLIOptions): string {
  if (options.projectId) return options.projectId;

  const saPath = path.resolve(process.cwd(), options.serviceAccountPath);
  if (fs.existsSync(saPath)) {
    const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
    return sa.project_id;
  }

  throw new Error("Project ID not found. Use --project-id or ensure service account file exists.");
}

async function main() {
  const { command, args, options } = parseArgs();

  if (command === "help") {
    console.log(`
Firebase Admin CLI

Commands:
  read-user <userId>                    Read user data including credits
  init-credits <userId>                 Initialize credits for a user
  set-credits <userId> <text> <image>   Set credits for a user
  list-users [--limit N]                List all users with credits
  credits-summary                       Get credits summary

Options:
  --service-account <path>    Path to service account JSON
  --project-id <id>           Firebase project ID
  --credits-collection <name> Credits collection (default: user_credits)
  --text-limit <n>            Default text limit (default: 100)
  --image-limit <n>           Default image limit (default: 100)

Examples:
  npx ts-node cli.ts read-user abc123
  npx ts-node cli.ts init-credits abc123 --text-limit 1000 --image-limit 100
  npx ts-node cli.ts set-credits abc123 500 50
  npx ts-node cli.ts list-users --limit 50
  npx ts-node cli.ts credits-summary
`);
    process.exit(0);
  }

  try {
    const projectId = getProjectId(options);
    const saPath = path.resolve(process.cwd(), options.serviceAccountPath);

    const app = initFirebaseAdmin({
      serviceAccountPath: saPath,
      projectId,
    });

    const db = getFirestoreAdmin(app);

    switch (command) {
      case "read-user": {
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
        break;
      }

      case "init-credits": {
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
          break;
        }

        const credits = await initializeUserCredits(db, userId, {
          collectionName: options.creditsCollection,
          textLimit: options.textLimit,
          imageLimit: options.imageLimit,
        });

        console.log("✅ Credits initialized:");
        console.log(`   Text: ${credits.text}`);
        console.log(`   Image: ${credits.image}`);
        break;
      }

      case "set-credits": {
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
        break;
      }

      case "list-users": {
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
        break;
      }

      case "credits-summary": {
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
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log("Run with 'help' for available commands.");
        process.exit(1);
    }

    resetFirebaseAdmin();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
