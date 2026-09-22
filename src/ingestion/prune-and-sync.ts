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
import { LeetCodeAdapter } from "./sources/leetcode/adapter";
import { runIngestionPipeline } from "./pipeline";

async function main() {
  console.log("=== STEP 1: Pruning Codeforces problems from Supabase ===");
  
  // Find all Codeforces problems
  const cfProblems = await db.problem.findMany({
    where: { platform: "Codeforces" },
    select: { id: true },
  });

  console.log(`Found ${cfProblems.length} Codeforces problems to remove.`);

  if (cfProblems.length > 0) {
    const cfIds = cfProblems.map((p: { id: string }) => p.id);
    
    // Batch delete in chunks of 500
    const CHUNK_SIZE = 500;
    for (let i = 0; i < cfIds.length; i += CHUNK_SIZE) {
      const chunk = cfIds.slice(i, i + CHUNK_SIZE);
      await db.problemTopic.deleteMany({
        where: { problemId: { in: chunk } },
      });
      await db.visualization.deleteMany({
        where: { problemId: { in: chunk } },
      });
      await db.problem.deleteMany({
        where: { id: { in: chunk } },
      });
      console.log(`Deleted ${Math.min(i + CHUNK_SIZE, cfIds.length)} / ${cfIds.length} Codeforces problems...`);
    }
  }

  console.log("Codeforces problems successfully removed.\n");

  console.log("=== STEP 2: Ingesting maximum LeetCode problems ===");
  const leetcodeAdapter = new LeetCodeAdapter();
  // Fetch up to 300 top LeetCode problems
  await runIngestionPipeline(leetcodeAdapter, 300);

  console.log("\n=== STEP 3: Verifying final database distribution ===");
  const total = await db.problem.count();
  const lcCount = await db.problem.count({ where: { platform: "LeetCode" } });
  const cfCount = await db.problem.count({ where: { platform: "Codeforces" } });

  console.log(`\nFinal State:`);
  console.log(`  Total Problems:    ${total}`);
  console.log(`  LeetCode Problems: ${lcCount}`);
  console.log(`  Codeforces:        ${cfCount}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
