import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problems as fallbackProblems } from "@/lib/problems";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const difficulty = searchParams.get("difficulty")?.trim() || "";
    const topic = searchParams.get("topic")?.trim().toLowerCase() || "";
    const platform = searchParams.get("platform")?.trim() || "";
    const visualizationType = searchParams.get("visualizationType")?.trim().toLowerCase() || "";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // If database is available, query Prisma
    if (db && db.problem) {
      try {
        const where: Record<string, unknown> = {};

        if (search) {
          where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { platformProblemId: { contains: search, mode: "insensitive" } },
          ];
        }

        if (difficulty && difficulty !== "all") {
          where.difficulty = { equals: difficulty, mode: "insensitive" };
        }

        if (platform && platform !== "all") {
          where.platform = { equals: platform, mode: "insensitive" };
        }

        if (visualizationType && visualizationType !== "all") {
          where.visualizationType = { equals: visualizationType, mode: "insensitive" };
        }

        if (topic && topic !== "all") {
          where.topics = {
            some: {
              topic: {
                name: { equals: topic, mode: "insensitive" },
              },
            },
          };
        }

        const [total, problems] = await Promise.all([
          db.problem.count({ where }),
          db.problem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
              topics: {
                include: {
                  topic: true,
                },
              },
              visualizations: true,
            },
          }),
        ]);

        if (total > 0 || search || (difficulty && difficulty !== "all") || (topic && topic !== "all") || (platform && platform !== "all")) {
          const formattedData = problems.map((p: any) => ({
            id: p.id,
            platform: p.platform,
            platformProblemId: p.platformProblemId,
            title: p.title,
            slug: p.slug,
            description: p.description,
            difficulty: p.difficulty,
            topics: p.topics.map((t: any) => t.topic.name),
            constraints: p.constraints,
            examples: p.examples,
            acceptanceRate: p.acceptanceRate,
            sourceUrl: p.sourceUrl,
            visualizationType: p.visualizationType,
            visualizations: p.visualizations,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }));

          return NextResponse.json({
            data: formattedData,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit) || 1,
            },
          });
        }
      } catch (dbErr) {
        console.warn("Prisma DB query failed, falling back to static data:", dbErr);
      }
    }

    // Fallback: Filter in-memory problem dataset
    const filtered = fallbackProblems.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.id.includes(search);
      const matchDiff = !difficulty || difficulty === "all" || p.difficulty.toLowerCase() === difficulty.toLowerCase();
      const matchTopic = !topic || topic === "all" || p.category.toLowerCase() === topic;
      const matchPlatform = !platform || platform === "all" || platform.toLowerCase() === "leetcode";
      return matchSearch && matchDiff && matchTopic && matchPlatform;
    });

    const paginated = filtered.slice(skip, skip + limit);

    const data = paginated.map((p) => ({
      id: p.id,
      platform: "LeetCode",
      platformProblemId: p.id,
      title: p.title,
      slug: p.id,
      description: p.description,
      difficulty: p.difficulty,
      topics: [p.category],
      constraints: p.constraints,
      examples: p.examples,
      acceptanceRate: 0,
      sourceUrl: `https://leetcode.com/problems/${p.id}`,
      visualizationType: p.category.toLowerCase(),
      visualizations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    });
  } catch (error) {
    console.error("API /api/problems error:", error);
    return NextResponse.json(
      {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
      },
      { status: 200 }
    );
  }
}

