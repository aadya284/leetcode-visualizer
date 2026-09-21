import fs from "fs";
import path from "path";

// Load environment variables from .env.local or .env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

import { db } from "../lib/db";
import { runIngestionPipeline } from "./pipeline";
import { availableSources, getSourceAdapter } from "./sources";

async function main() {
  const args = process.argv.slice(2);
  const targetSource = args.find((a) => !a.startsWith("-")) || "leetcode";
  
  let limit: number | undefined = undefined;
  const limitEq = args.find((a) => a.startsWith("--limit=") || a.startsWith("-limit="));
  if (limitEq) {
    limit = parseInt(limitEq.split("=")[1], 10);
  } else {
    const limitIdx = args.findIndex((a) => a === "--limit" || a === "-l");
    if (limitIdx !== -1 && args[limitIdx + 1]) {
      limit = parseInt(args[limitIdx + 1], 10);
    }
  }

  try {
    if (targetSource === "all") {
      for (const sourceKey of Object.keys(availableSources)) {
        try {
          const adapter = getSourceAdapter(sourceKey);
          await runIngestionPipeline(adapter, limit);
        } catch (err) {
          console.error(`Skipping ${sourceKey}: ${String(err)}`);
        }
      }
    } else {
      const adapter = getSourceAdapter(targetSource);
      await runIngestionPipeline(adapter, limit);
    }
  } catch (err) {
    console.error("Fatal ingestion error:", err);
    process.exit(1);
  } finally {
    if (db?.$disconnect) await db.$disconnect();
  }
}

main();
