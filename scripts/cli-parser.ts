/**
 * Firebase Admin CLI Parser
 * Command line argument parsing utilities
 */

import * as path from "path";
import * as fs from "fs";

export interface CLIOptions {
  serviceAccountPath: string;
  projectId?: string;
  creditsCollection: string;
  textLimit: number;
  imageLimit: number;
}

export interface ParsedArgs {
  command: string;
  args: string[];
  options: CLIOptions;
}

/**
 * Parse command line arguments
 */
export function parseArgs(): ParsedArgs {
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

/**
 * Get project ID from options or service account
 */
export function getProjectId(options: CLIOptions): string {
  if (options.projectId) return options.projectId;

  const saPath = path.resolve(process.cwd(), options.serviceAccountPath);
  if (fs.existsSync(saPath)) {
    const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
    return sa.project_id;
  }

  throw new Error("Project ID not found. Use --project-id or ensure service account file exists.");
}
