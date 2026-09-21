import { ProblemSource, RawProblem } from "../../types";
import { CFProblemsetResponse } from "./types";
import { mapCFProblemToRaw } from "./mapper";

export class CodeforcesAdapter implements ProblemSource {
  public readonly name = "Codeforces";
  private readonly apiUrl = "https://codeforces.com/api/problemset.problems";

  async fetchProblems(limit = 20): Promise<RawProblem[]> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          "User-Agent": "LeetVisual-Ingestion-Bot/1.0",
          Accept: "application/json",
        },
        // 15 seconds timeout
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(
          `Codeforces API returned HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as CFProblemsetResponse;

      if (data.status !== "OK" || !data.result) {
        throw new Error(
          `Codeforces API error: ${data.comment || "Unknown API error"}`
        );
      }

      const { problems, problemStatistics } = data.result;

      // Index statistics by `${contestId}${index}` for O(1) lookup
      const statsMap = new Map<string, (typeof problemStatistics)[0]>();
      if (Array.isArray(problemStatistics)) {
        for (const stat of problemStatistics) {
          statsMap.set(`${stat.contestId ?? 0}${stat.index}`, stat);
        }
      }

      const rawProblems: RawProblem[] = [];
      const targetProblems = limit ? problems.slice(0, limit) : problems;

      for (const p of targetProblems) {
        if (!p.name || !p.index) continue;
        const statKey = `${p.contestId ?? 0}${p.index}`;
        const stat = statsMap.get(statKey);
        rawProblems.push(mapCFProblemToRaw(p, stat));
      }

      return rawProblems;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch Codeforces problems: ${error.message}`);
      }
      throw new Error(`Failed to fetch Codeforces problems: ${String(error)}`);
    }
  }
}
