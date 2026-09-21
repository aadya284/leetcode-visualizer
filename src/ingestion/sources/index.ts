import { ProblemSource } from "../types";
import { CodeforcesAdapter } from "./codeforces/adapter";
import { LeetCodeAdapter } from "./leetcode/adapter";

export { CodeforcesAdapter } from "./codeforces/adapter";
export { LeetCodeAdapter } from "./leetcode/adapter";

export const availableSources: Record<string, () => ProblemSource> = {
  codeforces: () => new CodeforcesAdapter(),
  leetcode: () => new LeetCodeAdapter(),
};

export function getSourceAdapter(sourceName: string): ProblemSource {
  const normalized = sourceName.toLowerCase().trim();
  const factory = availableSources[normalized];
  if (!factory) {
    const valid = Object.keys(availableSources).join(", ");
    throw new Error(
      `Unknown problem source: "${sourceName}". Available sources: ${valid}`
    );
  }
  return factory();
}
