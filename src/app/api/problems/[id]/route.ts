import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problems as fallbackProblems } from "@/lib/problems";
import { fetchCodeforcesProblemDetails } from "@/ingestion/sources/codeforces/scraper";
import { fetchLeetCodeOfficialDetails } from "@/ingestion/sources/leetcode/scraper";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Problem identifier is required" },
        { status: 400 }
      );
    }

    const cleanId = decodeURIComponent(id).trim();

    // 1. Attempt to query database if available
    if (db && db.problem) {
      try {
        const problem = await db.problem.findFirst({
          where: {
            OR: [
              { id: cleanId },
              { slug: cleanId },
              { platformProblemId: cleanId },
              { title: { equals: cleanId, mode: "insensitive" } },
            ],
          },
          include: {
            topics: {
              include: {
                topic: true,
              },
            },
            visualizations: true,
          },
        });

        if (problem) {
          let description = problem.description || "";
          let examples = (problem.examples as any[]) || [];
          let constraints = (problem.constraints as string[]) || [];

          // Check if description is generic or a placeholder
          const isGeneric =
            !description ||
            description.includes("Visit the official problem page") ||
            description.includes("Given the LeetCode problem") ||
            description.includes("Explore DSA visualizer and test your algorithms") ||
            (description.startsWith("Problem ") && description.length < 60);

          // Check if there is curated rich data for this problem
          const cleanTitle = problem.title.toLowerCase().trim();
          const matchedStatic = fallbackProblems.find(
            (p) =>
              p.id === problem.platformProblemId ||
              p.title.toLowerCase().trim() === cleanTitle ||
              cleanTitle.includes(p.title.toLowerCase().trim())
          );

          // Live hydrate official LeetCode statement from official GraphQL if generic
          if (problem.platform === "LeetCode" && isGeneric) {
            let titleSlug = "";
            if (problem.sourceUrl) {
              const urlMatch = problem.sourceUrl.match(/\/problems\/([^/]+)/);
              if (urlMatch) titleSlug = urlMatch[1];
            }
            if (!titleSlug && problem.slug) {
              titleSlug = problem.slug.replace(/^leetcode-\d+-/, "").replace(/^leetcode-/, "");
            }
            if (!titleSlug) {
              titleSlug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            }

            if (titleSlug) {
              try {
                const official = await fetchLeetCodeOfficialDetails(titleSlug);
                if (official && official.description) {
                  description = official.description;
                  if (official.examples && official.examples.length > 0) {
                    examples = official.examples;
                  }
                  if (official.constraints && official.constraints.length > 0) {
                    constraints = official.constraints;
                  }

                  // Cache to DB
                  db.problem
                    .update({
                      where: { id: problem.id },
                      data: {
                        description,
                        examples,
                        constraints,
                      },
                    })
                    .catch(() => {});
                }
              } catch (lcErr) {
                console.warn("LeetCode official scraper fallback:", lcErr);
              }
            }
          }

          // If it's a Codeforces problem and lacks detailed statement, hydrate live and update DB
          if (
            problem.platform === "Codeforces" &&
            (!description || description.includes("Visit the official problem page") || examples.length === 0)
          ) {
            const match = problem.platformProblemId.match(/^(\d+)([A-Za-z0-9]+)$/);
            if (match) {
              const contestId = match[1];
              const index = match[2];
              try {
                const detailed = await fetchCodeforcesProblemDetails(contestId, index);
                if (detailed && detailed.description) {
                  description = detailed.description;
                  examples = detailed.examples.length > 0 ? detailed.examples : examples;
                  constraints = detailed.constraints.length > 0 ? detailed.constraints : constraints;

                  db.problem
                    .update({
                      where: { id: problem.id },
                      data: {
                        description: detailed.description,
                        examples: detailed.examples,
                        constraints: detailed.constraints,
                      },
                    })
                    .catch(() => {});
                }
              } catch (scrapeErr) {
                console.warn("Live scraper fallback:", scrapeErr);
              }
            }
          }

          const finalDescription = (isGeneric && matchedStatic && matchedStatic.description.length > description.length)
            ? matchedStatic.description
            : description;
          const finalExamples = (examples && examples.length > 0) ? examples : (matchedStatic?.examples || []);
          const finalConstraints = (constraints && constraints.length > 0) ? constraints : (matchedStatic?.constraints || []);

          return NextResponse.json({
            data: {
              id: problem.id,
              platform: problem.platform,
              platformProblemId: problem.platformProblemId,
              title: problem.title,
              slug: problem.slug,
              description: finalDescription,
              difficulty: problem.difficulty,
              topics: problem.topics.map((t: any) => t.topic.name),
              constraints: finalConstraints,
              examples: finalExamples,
              acceptanceRate: problem.acceptanceRate,
              sourceUrl: problem.sourceUrl,
              visualizationType: problem.visualizationType,
              visualizations: problem.visualizations,
              starterCode: matchedStatic?.starterCode,
              createdAt: problem.createdAt,
              updatedAt: problem.updatedAt,
            },
          });
        }
      } catch (dbErr) {
        console.warn("DB problem query error, checking fallback:", dbErr);
      }
    }

    // 2. Fallback: check in-memory problems or live LeetCode GraphQL
    const normalizedQuery = cleanId.toLowerCase().replace(/^(leetcode-|cf-|codeforces-)/, "");
    const fallback = fallbackProblems.find(
      (p) =>
        p.id === cleanId ||
        p.id === normalizedQuery ||
        p.title.toLowerCase() === cleanId.toLowerCase() ||
        p.title.toLowerCase().replace(/\s+/g, "-") === cleanId.toLowerCase() ||
        cleanId.toLowerCase().includes(p.title.toLowerCase().replace(/\s+/g, "-"))
    );

    if (fallback) {
      return NextResponse.json({
        data: {
          id: fallback.id,
          platform: "LeetCode",
          platformProblemId: fallback.id,
          title: fallback.title,
          slug: `leetcode-${fallback.id}-${fallback.title.toLowerCase().replace(/\s+/g, "-")}`,
          description: fallback.description,
          difficulty: fallback.difficulty,
          topics: [fallback.category],
          constraints: fallback.constraints,
          examples: fallback.examples,
          acceptanceRate: 52.4,
          sourceUrl: `https://leetcode.com/problems/${fallback.title.toLowerCase().replace(/\s+/g, "-")}/`,
          visualizationType: fallback.category.toLowerCase(),
          visualizations: [],
          starterCode: fallback.starterCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Attempt live GraphQL fetch for uncurated LeetCode problem identifier
    const slugMatch = cleanId.replace(/^leetcode-\d+-/, "").replace(/^leetcode-/, "");
    if (slugMatch) {
      try {
        const official = await fetchLeetCodeOfficialDetails(slugMatch);
        if (official && official.description) {
          const title = slugMatch
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          return NextResponse.json({
            data: {
              id: cleanId,
              platform: "LeetCode",
              platformProblemId: cleanId,
              title,
              slug: cleanId,
              description: official.description,
              difficulty: "Medium",
              topics: ["Algorithm"],
              constraints: official.constraints,
              examples: official.examples,
              acceptanceRate: 50.0,
              sourceUrl: `https://leetcode.com/problems/${slugMatch}/`,
              visualizationType: "algorithm",
              visualizations: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      } catch (err) {}
    }

    return NextResponse.json(
      { error: `Problem not found with identifier "${cleanId}"` },
      { status: 404 }
    );
  } catch (error) {
    console.error("API /api/problems/[id] error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch problem",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
