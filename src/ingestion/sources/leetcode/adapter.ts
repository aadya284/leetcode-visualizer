import { ProblemSource, RawProblem } from "../../types";
import { problems as staticLeetCodeProblems } from "../../../lib/problems";
import { fetchLeetCodeOfficialDetails } from "./scraper";

export class LeetCodeAdapter implements ProblemSource {
  public readonly name = "LeetCode";
  private readonly graphqlUrl = "https://leetcode.com/graphql";

  async fetchProblems(limit = 250): Promise<RawProblem[]> {
    const rawProblems: RawProblem[] = [];
    const seenIds = new Set<string>();

    // 1. Add all curated static LeetCode problems first
    for (const p of staticLeetCodeProblems) {
      seenIds.add(p.id);
      rawProblems.push({
        platform: "LeetCode",
        platformProblemId: p.id,
        title: p.title,
        description: p.description,
        difficultyRaw: p.difficulty,
        topicsRaw: [p.category],
        sourceUrl: `https://leetcode.com/problems/${this.slugify(p.title)}/`,
        acceptanceRate: 52.4,
        constraints: p.constraints,
        examples: p.examples,
      });
    }

    // 2. Paginate through official LeetCode GraphQL API to fetch up to requested limit
    const targetCount = limit || 250;
    const PAGE_SIZE = 50;
    let skip = 0;

    console.log(`[LeetCode Adapter] Fetching up to ${targetCount} LeetCode problems via GraphQL...`);

    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            frontendQuestionId: questionFrontendId
            title
            titleSlug
            difficulty
            acRate
            paidOnly: isPaidOnly
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    while (rawProblems.length < targetCount) {
      try {
        const fetchSize = Math.min(PAGE_SIZE, targetCount - rawProblems.length);
        const res = await fetch(this.graphqlUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: JSON.stringify({
            query,
            variables: {
              categorySlug: "",
              limit: fetchSize,
              skip: skip,
              filters: {},
            },
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          console.warn(`[LeetCode Adapter] GraphQL returned status ${res.status}`);
          break;
        }

        const json = await res.json();
        const questions = json?.data?.problemsetQuestionList?.questions || [];
        if (questions.length === 0) break;

        for (const q of questions) {
          const qId = String(q.frontendQuestionId || "");
          if (!qId || seenIds.has(qId)) continue;
          seenIds.add(qId);

          rawProblems.push({
            platform: "LeetCode",
            platformProblemId: qId,
            title: q.title,
            description: `Given the LeetCode problem "${q.title}" (#${qId}), design and implement an optimal algorithm. Analyze time and space complexity to ensure high performance.`,
            difficultyRaw: q.difficulty,
            topicsRaw: (q.topicTags || []).map((t: any) => t.name),
            sourceUrl: `https://leetcode.com/problems/${q.titleSlug}/`,
            acceptanceRate: Math.round(Number(q.acRate) * 10) / 10 || 0,
            constraints: [
              "Time limit: 1.0s",
              "Memory limit: 256 MB",
              "Optimal time complexity expected"
            ],
            examples: [
              {
                input: `Standard test cases for ${q.title}`,
                output: "Expected output according to problem specifications",
                explanation: `Verify with edge cases and optimal bounds for ${q.title}.`
              }
            ],
          });

          if (rawProblems.length >= targetCount) break;
        }

        skip += PAGE_SIZE;
        console.log(`[LeetCode Adapter] Retrieved ${rawProblems.length} / ${targetCount} problems (skip: ${skip})...`);
      } catch (err) {
        console.warn("[LeetCode Adapter] Error fetching batch:", err);
        break;
      }
    }

    return rawProblems;
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }
}

