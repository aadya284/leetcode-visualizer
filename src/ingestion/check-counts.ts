import fs from "fs";
import path from "path";

// Load environment variables
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

async function main() {
  console.log("Checking current problem counts in database...");
  const totalProblems = await db.problem.count();
  const cfCount = await db.problem.count({ where: { platform: "Codeforces" } });
  const lcCount = await db.problem.count({ where: { platform: "LeetCode" } });

  console.log(`Current DB State:`);
  console.log(`  Total: ${totalProblems}`);
  console.log(`  Codeforces: ${cfCount}`);
  console.log(`  LeetCode: ${lcCount}`);
}

main().catch(console.error).finally(() => db.$disconnect());
