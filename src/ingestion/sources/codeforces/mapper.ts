import { RawProblem } from "../../types";
import { CFProblem, CFProblemStatistics } from "./types";

const TAG_MAP: Record<string, string> = {
  "dp": "Dynamic Programming",
  "data structures": "Data Structures",
  "graphs": "Graph",
  "trees": "Tree",
  "sortings": "Sorting",
  "binary search": "Binary Search",
  "strings": "String",
  "two pointers": "Two Pointers",
  "math": "Math",
  "greedy": "Greedy",
  "dfs and similar": "Depth-First Search",
  "dsu": "Disjoint Set Union",
  "shortest paths": "Shortest Paths",
  "matrices": "Matrix",
  "bitmasks": "Bit Manipulation",
  "brute force": "Brute Force",
  "constructive algorithms": "Constructive Algorithms",
  "number theory": "Number Theory",
  "combinatorics": "Combinatorics",
  "geometry": "Geometry",
  "games": "Game Theory",
  "divide and conquer": "Divide and Conquer",
  "hashing": "Hash Table",
  "implementation": "Implementation",
};

export function mapCFTagToTopic(tag: string): string {
  const lower = tag.toLowerCase().trim();
  if (TAG_MAP[lower]) return TAG_MAP[lower];
  // Capitalize title case fallback
  return lower
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function mapCFRatingToDifficulty(rating?: number): "Easy" | "Medium" | "Hard" | "Unknown" {
  if (typeof rating !== "number" || isNaN(rating)) return "Unknown";
  if (rating <= 1200) return "Easy";
  if (rating <= 1800) return "Medium";
  return "Hard";
}

export function mapCFProblemToRaw(
  problem: CFProblem,
  stat?: CFProblemStatistics
): RawProblem {
  const contestId = problem.contestId ?? 0;
  const problemId = `${contestId}${problem.index}`;
  const sourceUrl = problem.contestId
    ? `https://codeforces.com/problemset/problem/${contestId}/${problem.index}`
    : `https://codeforces.com/problemset`;

  const mappedTopics = (problem.tags || []).map(mapCFTagToTopic);

  return {
    platform: "Codeforces",
    platformProblemId: problemId,
    title: problem.name.trim(),
    description: `Codeforces Problem ${contestId}${problem.index}: ${problem.name}. Visit the official problem page for full statements, test cases, and time/memory limits.`,
    difficultyRaw: problem.rating,
    topicsRaw: mappedTopics,
    sourceUrl,
    acceptanceRate: 0,
    constraints: [],
    examples: [],
    extraMetadata: {
      contestId: problem.contestId,
      index: problem.index,
      type: problem.type,
      points: problem.points,
      rating: problem.rating,
      solvedCount: stat?.solvedCount ?? 0,
      tags: problem.tags,
    },
  };
}
