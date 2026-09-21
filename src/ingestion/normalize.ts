import { Difficulty, NormalizedProblem, RawProblem, VisualizationType } from "./types";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function inferVisualizationType(
  title: string,
  topics: string[]
): VisualizationType {
  const combined = `${title} ${topics.join(" ")}`.toLowerCase();

  if (combined.includes("binary search")) return "binary-search";
  if (combined.includes("sliding window")) return "sliding-window";
  if (combined.includes("two pointer") || combined.includes("two pointers"))
    return "two-pointer";
  if (combined.includes("linked list")) return "linked-list";
  if (combined.includes("stack")) return "stack";
  if (combined.includes("queue")) return "queue";
  if (combined.includes("tree") || combined.includes("trees")) return "tree";
  if (
    combined.includes("graph") ||
    combined.includes("shortest path") ||
    combined.includes("dfs") ||
    combined.includes("bfs")
  )
    return "graph";
  if (combined.includes("sort") || combined.includes("sorting")) return "sorting";
  if (
    combined.includes("dp") ||
    combined.includes("dynamic programming") ||
    combined.includes("memoization")
  )
    return "dynamic-programming";
  if (combined.includes("recursion") || combined.includes("backtracking"))
    return "recursion";
  if (combined.includes("array") || combined.includes("vector")) return "array";

  return "unknown";
}

export function normalizeDifficulty(raw: unknown): Difficulty {
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    if (s === "easy") return "Easy";
    if (s === "medium" || s === "med") return "Medium";
    if (s === "hard") return "Hard";
  }

  if (typeof raw === "number" && !isNaN(raw)) {
    if (raw <= 1200) return "Easy";
    if (raw <= 1800) return "Medium";
    return "Hard";
  }

  return "Unknown";
}

export function normalizeProblem(raw: RawProblem): NormalizedProblem {
  const title = raw.title.trim();
  const baseSlug = slugify(title) || slugify(raw.platformProblemId);
  const platformPrefix = slugify(raw.platform);
  
  // Format slug cleanly, using platform and id to avoid cross-platform collision
  const slug = `${platformPrefix}-${slugify(raw.platformProblemId)}-${baseSlug}`.toLowerCase();

  const difficulty = normalizeDifficulty(raw.difficultyRaw);

  const cleanTopics = Array.from(
    new Set(
      (raw.topicsRaw || [])
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );

  const visualizationType = inferVisualizationType(title, cleanTopics);

  return {
    platform: raw.platform.trim(),
    platformProblemId: raw.platformProblemId.trim(),
    title,
    slug,
    description: raw.description?.trim() || "",
    difficulty,
    topics: cleanTopics,
    constraints: raw.constraints || [],
    examples: raw.examples || [],
    acceptanceRate: Math.max(0, Math.min(100, Number(raw.acceptanceRate) || 0)),
    sourceUrl: raw.sourceUrl.trim(),
    visualizationType,
  };
}
