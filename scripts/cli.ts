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
import {
  initFirebaseAdmin,
  getFirestoreAdmin,
  resetFirebaseAdmin,
} from "./init";
import { parseArgs, getProjectId } from "./cli-parser";
import {
  handleReadUser,
  handleInitCredits,
  handleSetCredits,
  handleListUsers,
  handleCreditsSummary,
} from "./cli-handlers";

function printHelp(): void {
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
}

async function main() {
  const { command, args, options } = parseArgs();

  if (command === "help") {
    printHelp();
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
      case "read-user":
        await handleReadUser(db, args, options);
        break;

      case "init-credits":
        await handleInitCredits(db, args, options);
        break;

      case "set-credits":
        await handleSetCredits(db, args, options);
        break;

      case "list-users":
        await handleListUsers(db, args, options);
        break;

      case "credits-summary":
        await handleCreditsSummary(db, options);
        break;

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
