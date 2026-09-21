import { db } from "../lib/db";
import { deduplicateProblems } from "./deduplicate";
import { normalizeProblem } from "./normalize";
import { IngestionResult, NormalizedProblem, ProblemSource } from "./types";
import { validateProblem } from "./validate";

export async function runIngestionPipeline(
  source: ProblemSource,
  limit?: number
): Promise<IngestionResult> {
  const result: IngestionResult = {
    source: source.name,
    fetched: 0,
    valid: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    errorMessages: [],
  };

  console.log(`\n========================================`);
  console.log(`${source.name} ingestion started...`);
  console.log(`========================================\n`);

  try {
    // 1. Fetch raw problems from source
    const rawProblems = await source.fetchProblems(limit);
    result.fetched = rawProblems.length;
    console.log(`[1/4] Fetched ${rawProblems.length} raw problems from ${source.name}`);

    // 2. Normalize raw problems
    const normalizedList: NormalizedProblem[] = [];
    for (const raw of rawProblems) {
      try {
        const normalized = normalizeProblem(raw);
        normalizedList.push(normalized);
      } catch (err) {
        result.skipped++;
        result.errorMessages.push(
          `Normalization error for ${raw.platformProblemId}: ${String(err)}`
        );
      }
    }

    // 3. Validate normalized problems
    const validProblems: NormalizedProblem[] = [];
    for (const prob of normalizedList) {
      const validation = validateProblem(prob);
      if (validation.isValid) {
        validProblems.push(prob);
      } else {
        result.skipped++;
        result.errorMessages.push(
          `Validation failed for ${prob.platformProblemId} (${prob.title}): ${validation.errors.join(", ")}`
        );
      }
    }
    result.valid = validProblems.length;
    console.log(`[2/4] Validated: ${validProblems.length} valid, ${result.skipped} skipped`);

    // 4. Deduplicate in-batch problems
    const deduplicated = deduplicateProblems(validProblems);
    console.log(`[3/4] Deduplicated: ${deduplicated.length} unique problems to process`);

    // 5. Database Upsert with Prisma
    if (!db || !db.problem) {
      console.warn(
        "\n[!] Prisma client is not yet generated or connected to a database."
      );
      console.warn(
        "[!] Please ensure DATABASE_URL is set and run 'npm install' & 'npx prisma generate'.\n"
      );
      result.skipped += deduplicated.length;
      return result;
    }

    // Pre-upsert all unique topics to prevent race conditions
    const allTopicNames = Array.from(
      new Set(deduplicated.flatMap((p) => p.topics))
    );
    console.log(`[4/5] Syncing ${allTopicNames.length} unique topics...`);

    const topicMap = new Map<string, string>();
    for (const topicName of allTopicNames) {
      try {
        const t = await db.topic.upsert({
          where: { name: topicName },
          update: {},
          create: { name: topicName },
        });
        topicMap.set(topicName, t.id);
      } catch (err) {
        // If already exists, fetch ID
        const existing = await db.topic.findUnique({ where: { name: topicName } });
        if (existing) topicMap.set(topicName, existing.id);
      }
    }

    console.log(`[5/5] Upserting ${deduplicated.length} problems into database...`);

    // Process in batches of 25 for optimal network performance
    const BATCH_SIZE = 25;
    for (let i = 0; i < deduplicated.length; i += BATCH_SIZE) {
      const batch = deduplicated.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (p) => {
          try {
            const topicIds = p.topics
              .map((t) => topicMap.get(t))
              .filter(Boolean) as string[];

            // Check if problem already exists
            const existingProblem = await db.problem.findUnique({
              where: {
                platform_platformProblemId: {
                  platform: p.platform,
                  platformProblemId: p.platformProblemId,
                },
              },
            });

            if (existingProblem) {
              // Update existing problem
              const updated = await db.problem.update({
                where: { id: existingProblem.id },
                data: {
                  title: p.title,
                  slug: p.slug,
                  description: p.description,
                  difficulty: p.difficulty,
                  acceptanceRate: p.acceptanceRate,
                  sourceUrl: p.sourceUrl,
                  visualizationType: p.visualizationType,
                  constraints: p.constraints,
                  examples: p.examples,
                },
              });

              // Re-sync topics
              await db.problemTopic.deleteMany({
                where: { problemId: updated.id },
              });

              if (topicIds.length > 0) {
                await db.problemTopic.createMany({
                  data: topicIds.map((tid) => ({
                    problemId: updated.id,
                    topicId: tid,
                  })),
                  skipDuplicates: true,
                });
              }

              result.updated++;
            } else {
              // Create new problem
              await db.problem.create({
                data: {
                  platform: p.platform,
                  platformProblemId: p.platformProblemId,
                  title: p.title,
                  slug: p.slug,
                  description: p.description,
                  difficulty: p.difficulty,
                  acceptanceRate: p.acceptanceRate,
                  sourceUrl: p.sourceUrl,
                  visualizationType: p.visualizationType,
                  constraints: p.constraints,
                  examples: p.examples,
                  topics: {
                    create: topicIds.map((tid) => ({
                      topicId: tid,
                    })),
                  },
                  visualizations: {
                    create: {
                      type: p.visualizationType,
                      configuration: {
                        source: p.platform,
                        initialView: p.visualizationType,
                      },
                    },
                  },
                },
              });

              result.inserted++;
            }
          } catch (err) {
            result.errors++;
            const msg = `DB error for ${p.platform} ${p.platformProblemId}: ${String(err)}`;
            result.errorMessages.push(msg);
          }
        })
      );

      if ((i + BATCH_SIZE) % 100 === 0 || i + BATCH_SIZE >= deduplicated.length) {
        console.log(`  Processed ${Math.min(i + BATCH_SIZE, deduplicated.length)} / ${deduplicated.length} problems...`);
      }
    }
  } catch (pipelineErr) {
    result.errors++;
    result.errorMessages.push(`Pipeline failure: ${String(pipelineErr)}`);
  }

  // Summary Output
  console.log(`\n----------------------------------------`);
  console.log(`Fetched:  ${result.fetched}`);
  console.log(`Valid:    ${result.valid}`);
  console.log(`Inserted: ${result.inserted}`);
  console.log(`Updated:  ${result.updated}`);
  console.log(`Skipped:  ${result.skipped}`);
  console.log(`Errors:   ${result.errors}`);
  console.log(`----------------------------------------`);
  console.log(`Ingestion completed.\n`);

  return result;
}
