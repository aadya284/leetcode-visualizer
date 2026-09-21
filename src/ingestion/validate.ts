import { NormalizedProblem } from "./types";

const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Hard", "Unknown"]);
const VALID_VIS_TYPES = new Set([
  "array",
  "binary-search",
  "sliding-window",
  "two-pointer",
  "linked-list",
  "stack",
  "queue",
  "tree",
  "graph",
  "sorting",
  "recursion",
  "dynamic-programming",
  "unknown",
]);

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProblem(problem: NormalizedProblem): ValidationResult {
  const errors: string[] = [];

  if (!problem.platform || problem.platform.trim().length === 0) {
    errors.push("Platform is required");
  }

  if (!problem.platformProblemId || problem.platformProblemId.trim().length === 0) {
    errors.push("Platform Problem ID is required");
  }

  if (!problem.title || problem.title.trim().length === 0) {
    errors.push("Problem title is required");
  }

  if (!problem.slug || problem.slug.trim().length === 0) {
    errors.push("Problem slug is required");
  }

  if (!problem.sourceUrl || !problem.sourceUrl.startsWith("http")) {
    errors.push("Valid sourceUrl is required");
  }

  if (!VALID_DIFFICULTIES.has(problem.difficulty)) {
    errors.push(`Invalid difficulty: "${problem.difficulty}"`);
  }

  if (!VALID_VIS_TYPES.has(problem.visualizationType)) {
    errors.push(`Invalid visualizationType: "${problem.visualizationType}"`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
