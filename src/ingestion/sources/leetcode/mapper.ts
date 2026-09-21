import { RawProblem } from "../../types";
import { LeetCodeQuestion } from "./types";

export function mapLeetCodeQuestionToRaw(q: LeetCodeQuestion): RawProblem {
  return {
    platform: "LeetCode",
    platformProblemId: q.questionFrontendId || q.questionId,
    title: q.title,
    description: q.content || "",
    difficultyRaw: q.difficulty,
    topicsRaw: (q.topicTags || []).map((t) => t.name),
    sourceUrl: `https://leetcode.com/problems/${q.titleSlug}/`,
    acceptanceRate: q.acRate ? Math.round(q.acRate * 10) / 10 : 0,
    constraints: [],
    examples: [],
  };
}
