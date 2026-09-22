import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// In-memory fallback cache if database table is not yet migrated
let memorySubmissions: any[] = [];

// POST /api/submissions - Save a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      problemId,
      problemTitle,
      difficulty,
      language,
      code,
      status,
      runtime,
      runtimeMs,
      memory,
      passedCases,
      totalCases,
      error,
    } = body;

    if (!problemId || !code || !language || !status) {
      return NextResponse.json(
        { error: "Missing required submission fields" },
        { status: 400 }
      );
    }

    const fallbackRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      problemId: String(problemId),
      problemTitle: problemTitle || null,
      difficulty: difficulty || null,
      language: String(language),
      code: String(code),
      status: String(status),
      runtime: runtime || null,
      runtimeMs: runtimeMs ? parseInt(String(runtimeMs)) : null,
      memory: memory || null,
      passedCases: passedCases ? parseInt(String(passedCases)) : null,
      totalCases: totalCases ? parseInt(String(totalCases)) : null,
      error: error || null,
      createdAt: new Date().toISOString(),
    };

    memorySubmissions.unshift(fallbackRecord);
    if (memorySubmissions.length > 200) memorySubmissions = memorySubmissions.slice(0, 200);

    if (db && db.submission) {
      try {
        const submission = await db.submission.create({
          data: {
            problemId: String(problemId),
            problemTitle: problemTitle || null,
            difficulty: difficulty || null,
            language: String(language),
            code: String(code),
            status: String(status),
            runtime: runtime || null,
            runtimeMs: runtimeMs ? parseInt(String(runtimeMs)) : null,
            memory: memory || null,
            passedCases: passedCases ? parseInt(String(passedCases)) : null,
            totalCases: totalCases ? parseInt(String(totalCases)) : null,
            error: error || null,
          },
        });

        return NextResponse.json({
          success: true,
          data: submission,
        });
      } catch (dbErr) {
        console.warn("Database save failed, using in-memory fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: fallbackRecord,
    });
  } catch (err: any) {
    console.error("Failed to save submission:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/submissions?problemId=XYZ - Get submission history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (db && db.submission) {
      try {
        const where: any = {};
        if (problemId) {
          where.problemId = String(problemId);
        }

        const submissions = await db.submission.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: Math.min(100, limit),
        });

        if (submissions && submissions.length > 0) {
          return NextResponse.json({
            success: true,
            data: submissions,
          });
        }
      } catch (dbErr) {
        console.warn("Database query failed, checking in-memory fallback:", dbErr);
      }
    }

    // Return in-memory fallback if available
    let filtered = memorySubmissions;
    if (problemId) {
      filtered = memorySubmissions.filter((s) => s.problemId === String(problemId));
    }

    return NextResponse.json({
      success: true,
      data: filtered.slice(0, limit),
    });
  } catch (err: any) {
    console.error("Failed to fetch submissions:", err);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
