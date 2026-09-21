import { db } from "../lib/db";

async function main() {
  if (!db) {
    console.error("Database connection not found");
    return;
  }

  const tables = ["Problem", "Topic", "ProblemTopic", "Visualization"];

  console.log("Securing Supabase tables with Row Level Security (RLS)...");

  for (const table of tables) {
    try {
      // 1. Enable RLS
      await db.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✓ Enabled RLS on public."${table}"`);

      // 2. Drop existing policy if exists and create read policy for public select
      try {
        await db.$executeRawUnsafe(`DROP POLICY IF EXISTS "Allow public read access" ON "${table}";`);
        await db.$executeRawUnsafe(`CREATE POLICY "Allow public read access" ON "${table}" FOR SELECT USING (true);`);
        console.log(`✓ Added public SELECT policy on public."${table}"`);
      } catch (policyErr) {
        console.warn(`Policy notice on "${table}":`, policyErr);
      }
    } catch (err) {
      console.error(`Error securing table "${table}":`, err);
    }
  }

  console.log("\nAll Supabase tables are now secured with RLS enabled and public read access configured.");
}

main()
  .catch(console.error)
  .finally(async () => {
    if (db) await db.$disconnect();
  });
